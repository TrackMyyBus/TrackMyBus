// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import passwordRoutes from "./routes/password.js";
import studentRoutes from "./routes/student.js";
import driverRoutes from "./routes/driver.js";
import busRoutes from "./routes/bus.js";
import routeRoutes from "./routes/route.js";
import adminRoutes from "./routes/admin.js";
import locationRoutes from "./routes/location.js";
import chatRoutes from "./routes/chat.js";

// Models
import Driver from "./models/Driver.js";
import Bus from "./models/Bus.js";
import BusLocation from "./models/BusLocation.js";
import ChatRoom from "./models/ChatRoom.js";
import Message from "./models/Message.js";

import { getUserFromSocketToken } from "./utils/authSocket.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create Socket.IO server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ============================================================
// SOCKET.IO HANDLER
// ============================================================

io.on("connection", async (socket) => {
  console.log("🟢 Client connected:", socket.id);

  const handshakeToken =
    socket.handshake.auth?.token || socket.handshake.query?.token || null;

  // FIXED → MUST await
  const handshakeUser = await getUserFromSocketToken(handshakeToken);

  if (handshakeUser) {
    if (handshakeUser.role === "driver") socket.join("drivers_room");
    if (handshakeUser.role === "student") socket.join("students_room");
    if (handshakeUser.busId) socket.join(`bus_${handshakeUser.busId}`);

    socket.user = handshakeUser;
  }

  // ------------------------------
  // DRIVER LOCATION
  // ------------------------------

  socket.on("driver-start", async ({ driverId, busId }) => {
    try {
      console.log("🚐 Driver started:", driverId);

      await Driver.findByIdAndUpdate(driverId, {
        socketId: socket.id,
        isSharingLocation: true,
      });

      await Bus.findByIdAndUpdate(busId, {
        trackingStatus: "online",
      });

      socket.join(`bus_${busId}`);
    } catch (err) {
      console.error("driver-start error:", err);
    }
  });

  socket.on("driver-location", async (data) => {
    const { driverId, busId, latitude, longitude, speed, heading, battery } =
      data;

    try {
      await Bus.findByIdAndUpdate(busId, {
        currentLocation: {
          latitude,
          longitude,
          speed,
          heading,
          battery,
          lastUpdated: new Date(),
        },
        trackingStatus: "online",
      });

      await BusLocation.create({
        bus: busId,
        driver: driverId,
        latitude,
        longitude,
        speed,
        timestamp: new Date(),
        status: speed > 0 ? "moving" : "stopped",
      });

      io.to(`bus_${busId}`).emit(`bus-${busId}-location`, {
        latitude,
        longitude,
        speed,
        heading,
        battery,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("driver-location error:", err);
    }
  });

  // ------------------------------
  // CHAT EVENTS
  // ------------------------------

  socket.on("chat-join", async ({ token, roomName, roomType }) => {
    try {
      const user = token ? await getUserFromSocketToken(token) : socket.user;

      if (!user) return;

      socket.join(roomName);

      let room = await ChatRoom.findOne({ roomName });
      if (!room) {
        room = await ChatRoom.create({
          roomName,
          roomType: roomType || "direct",
          members: [user._id],
        });
      } else {
        if (!room.members.includes(user._id)) {
          room.members.push(user._id);
          await room.save();
        }
      }

      console.log(`🟢 ${user.name} joined ${roomName}`);
    } catch (err) {
      console.error("chat-join error:", err);
    }
  });

  socket.on("chat-send", async ({ token, roomName, text }) => {
    try {
      const user = token ? await getUserFromSocketToken(token) : socket.user;

      if (!user) {
        console.log("❌ chat-send user null");
        return;
      }

      let room = await ChatRoom.findOne({ roomName });
      if (!room) {
        room = await ChatRoom.create({
          roomName,
          roomType: "direct",
          members: [user._id],
        });
      }

      const msg = await Message.create({
        roomId: room._id,
        senderId: user._id,
        senderName: user.name,
        text,
      });

      io.to(roomName).emit("chat-receive", {
        _id: msg._id,
        roomId: room._id,
        senderId: user._id,
        senderName: user.name,
        text: msg.text,
        createdAt: msg.createdAt,
      });

      console.log(`💬 ${user.name}: ${text}`);
    } catch (err) {
      console.error("chat-send error:", err);
    }
  });

  socket.on("admin-broadcast", async ({ token, target, text }) => {
    try {
      const user = token ? await getUserFromSocketToken(token) : socket.user;

      if (!user || user.role !== "admin") return;

      let roomName =
        target === "drivers"
          ? "broadcast_drivers"
          : target === "students"
          ? "broadcast_students"
          : `broadcast_${target}`;

      let room = await ChatRoom.findOne({ roomName });
      if (!room) {
        room = await ChatRoom.create({
          roomName,
          roomType: "broadcast",
        });
      }

      const msg = await Message.create({
        roomId: room._id,
        senderId: user._id,
        senderName: "ADMIN",
        text,
      });

      if (target === "drivers")
        io.to("drivers_room").emit("chat-broadcast-receive", msg);
      else if (target === "students")
        io.to("students_room").emit("chat-broadcast-receive", msg);
      else if (target.startsWith("bus_"))
        io.to(target).emit("chat-broadcast-receive", msg);
      else io.emit("chat-broadcast-receive", msg);

      console.log(`📢 Admin broadcast: ${text}`);
    } catch (err) {
      console.error("admin-broadcast error:", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log("🔴 Socket disconnected:", socket.id);
    const driver = await Driver.findOne({ socketId: socket.id });
    if (driver) {
      driver.isSharingLocation = false;
      driver.socketId = null;
      await driver.save();
    }
  });
});

// ============================================================
// ROUTES
// ============================================================

app.get("/", (req, res) => res.send("TrackMyBus running successfully"));
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/chat", chatRoutes);

// ============================================================
// START SERVER
// ============================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
