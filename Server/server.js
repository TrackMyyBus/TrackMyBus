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
import chatRoutes from "./routes/chat.js"; // <-- new

// Models for tracking
import Driver from "./models/Driver.js";
import Bus from "./models/Bus.js";
import BusLocation from "./models/BusLocation.js";

// Chat models
import ChatRoom from "./models/ChatRoom.js";
import Message from "./models/Message.js";

import { getUserFromSocketToken } from "./utils/authSocket.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create server for Socket.IO
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ============================================================
// ✅ SOCKET.IO IMPLEMENTATION FOR REAL-TIME TRACKING + CHAT
// ============================================================

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Optionally get token from handshake (client may pass token on connect)
  const handshakeToken =
    socket.handshake.auth?.token || socket.handshake.query?.token || null;
  const handshakeUser = getUserFromSocketToken(handshakeToken);

  // If connected user is driver, add them to driver room and bus room if busId present
  if (handshakeUser) {
    // join global driver or student rooms for admin broadcast convenience
    if (handshakeUser.role === "driver") socket.join("drivers_room");
    if (handshakeUser.role === "student") socket.join("students_room");
    if (handshakeUser.busId) {
      socket.join(`bus_${handshakeUser.busId}`);
    }
    // attach user info to socket for later use
    socket.user = handshakeUser;
  }

  // ------------------------------
  // DRIVER TRACKING EVENTS (your existing code)
  // ------------------------------

  socket.on("driver-start", async ({ driverId, busId }) => {
    try {
      console.log("🚐 Driver started sharing:", driverId);

      await Driver.findByIdAndUpdate(driverId, {
        socketId: socket.id,
        isSharingLocation: true,
      });

      await Bus.findByIdAndUpdate(busId, {
        trackingStatus: "online",
      });

      // Make the driver socket join the bus room so admin/students can receive location via bus room.
      socket.join(`bus_${busId}`);
    } catch (err) {
      console.error("Error in driver-start:", err);
    }
  });

  socket.on("driver-location", async (data) => {
    const { driverId, busId, latitude, longitude, speed, heading, battery } =
      data;

    try {
      console.log("📍 Live location received for bus:", busId);

      // Save current location in Bus model
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

      // Store historical data
      await BusLocation.create({
        bus: busId,
        driver: driverId,
        latitude,
        longitude,
        speed,
        timestamp: new Date(),
        status: speed > 0 ? "moving" : "stopped",
      });

      // Broadcast live update to students (only to the specific bus room)
      io.to(`bus_${busId}`).emit(`bus-${busId}-location`, {
        latitude,
        longitude,
        speed,
        heading,
        battery,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error saving driver-location:", err);
    }
  });

  // ------------------------------
  // CHAT EVENTS (new)
  // ------------------------------

  // join a chat room (bus group, direct or broadcast)
  socket.on("chat-join", async ({ token, roomName, roomType }) => {
    try {
      const user = token ? getUserFromSocketToken(token) : socket.user;
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
        // add member if not present
        if (!room.members.map((m) => m.toString()).includes(user._id)) {
          room.members.push(user._id);
          await room.save();
        }
      }

      console.log(`🟢 User ${user.name} joined ${roomName}`);
    } catch (err) {
      console.error("chat-join error:", err);
    }
  });

  // send a chat message
  socket.on("chat-send", async ({ token, roomName, text }) => {
    try {
      const user = token ? getUserFromSocketToken(token) : socket.user;
      if (!user) return;

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
        senderName: user.name || "Unknown",
        text,
      });

      io.to(roomName).emit("chat-receive", {
        _id: msg._id,
        roomId: room._id,
        senderId: user._id,
        senderName: user.name || "Unknown",
        text: msg.text,
        createdAt: msg.createdAt,
      });

      console.log(`💬 Message in ${roomName} by ${user.name}: ${text}`);
    } catch (err) {
      console.error("chat-send error:", err);
    }
  });

  // admin broadcast (via socket)
  socket.on("admin-broadcast", async ({ token, target, text }) => {
    try {
      const user = token ? getUserFromSocketToken(token) : socket.user;
      if (!user || user.role !== "admin") return;

      // target e.g., "drivers" | "students" | "all" | "bus_101"
      let roomName;
      if (target === "drivers") roomName = "broadcast_drivers";
      else if (target === "students") roomName = "broadcast_students";
      else roomName = `broadcast_${target}`;

      let room = await ChatRoom.findOne({ roomName });
      if (!room) {
        room = await ChatRoom.create({ roomName, roomType: "broadcast" });
      }

      const msg = await Message.create({
        roomId: room._id,
        senderId: user._id,
        senderName: user.name || "ADMIN",
        text,
      });

      // Broadcast - targeted or global
      if (target === "drivers")
        io.to("drivers_room").emit("chat-broadcast-receive", {
          text,
          senderName: "ADMIN",
          createdAt: msg.createdAt,
        });
      else if (target === "students")
        io.to("students_room").emit("chat-broadcast-receive", {
          text,
          senderName: "ADMIN",
          createdAt: msg.createdAt,
        });
      else if (target?.startsWith("bus_"))
        io.to(target).emit("chat-broadcast-receive", {
          text,
          senderName: "ADMIN",
          createdAt: msg.createdAt,
        });
      else
        io.emit("chat-broadcast-receive", {
          text,
          senderName: "ADMIN",
          createdAt: msg.createdAt,
        });

      console.log(`📢 Admin broadcast to ${target}: ${text}`);
    } catch (err) {
      console.error("admin-broadcast error:", err);
    }
  });

  // ------------------------------
  // DISCONNECT
  // ------------------------------
  socket.on("disconnect", async () => {
    console.log("🔴 Socket disconnected:", socket.id);
    try {
      // If there is a driver with this socket id, mark them offline
      const driver = await Driver.findOne({ socketId: socket.id });
      if (driver) {
        driver.isSharingLocation = false;
        driver.socketId = null;
        await driver.save();
      }
    } catch (err) {
      console.error("disconnect cleanup error:", err);
    }
  });
});

// ============================================================
// ✅ ROUTES
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
app.use("/api/chat", chatRoutes); // <-- chat routes

// ============================================================
// ✅ MONGODB CONNECTION
// ============================================================

mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser and useUnifiedTopology are passed implicitly in newer drivers
  })
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// ============================================================
// ✅ START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
