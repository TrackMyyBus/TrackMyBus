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

  // SAFE MODE — ROLE-BASED ROOMS SETUP
  socket.on("setup-rooms", async ({ token }) => {
    const user = token ? await getUserFromSocketToken(token) : socket.user;
    if (!user) return;

    // ADMIN
    if (user.role === "admin") {
      socket.join(`admin_${user._id}`);
      socket.join("admins_group");
      socket.join("all_students");
      socket.join("all_drivers");
    }

    // DRIVER
    if (user.role === "driver") {
      socket.join(`driver_${user._id}`);
      if (user.busId) {
        socket.join(`bus_${user.busId}`);
        socket.join(`bus_students_${user.busId}`);
      }
    }

    // STUDENT
    if (user.role === "student") {
      socket.join(`student_${user._id}`);
      if (user.busId) {
        socket.join(`bus_${user.busId}`);
        socket.join(`bus_driver_${user.busId}`);
      }
    }

    console.log("Safe-mode rooms prepared for:", user.role);
  });

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

  // ========================
  // ⭐ ROLE-BASED, ADMIN-ISOLATED CHAT
  // ========================
  io.on("connection", async (socket) => {
    console.log("🟢 Client connected:", socket.id);

    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return socket.disconnect();
    }

    const user = await User.findById(payload.id).lean();
    if (!user) return socket.disconnect();

    socket.user = user;

    // GET ADMIN ID FOR USER (used for isolation)
    let adminId = null;

    if (user.role === "admin") {
      const admin = await Admin.findOne({ userId: user._id }).lean();
      adminId = admin._id.toString();
    }

    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id })
        .populate("institute")
        .lean();

      adminId = student.institute._id.toString();
      socket.join(`student_${user._id}_${adminId}`);
      if (student.assignedBus)
        socket.join(`bus_${student.assignedBus}_${adminId}`);
    }

    if (user.role === "driver") {
      const driver = await Driver.findOne({ userId: user._id })
        .populate("institute")
        .lean();

      adminId = driver.institute._id.toString();
      socket.join(`driver_${user._id}_${adminId}`);
      if (driver.assignedBus)
        socket.join(`bus_${driver.assignedBus}_${adminId}`);
    }

    // STORE adminId on socket
    socket.adminId = adminId;

    console.log("🌟 Rooms joined:", socket.rooms);

    // =============================
    // ⭐ JOIN CHAT ROOM
    // =============================
    socket.on("chat-join", async ({ roomName, roomType }) => {
      if (!socket.adminId) return;

      // ALWAYS attach adminId
      const finalRoom = `${roomName}_${socket.adminId}`;

      socket.join(finalRoom);

      let room = await ChatRoom.findOne({ roomName: finalRoom });
      if (!room) {
        room = await ChatRoom.create({
          roomName: finalRoom,
          roomType,
          members: [user._id],
          adminId: socket.adminId,
        });
      } else if (!room.members.includes(user._id)) {
        room.members.push(user._id);
        await room.save();
      }

      console.log(`🟢 ${user.name} joined ${finalRoom}`);
    });

    // =============================
    // ⭐ SEND MESSAGE
    // =============================
    socket.on("chat-send", async ({ roomName, text }) => {
      if (!socket.adminId) return;

      const finalRoom = `${roomName}_${socket.adminId}`;

      let room = await ChatRoom.findOne({ roomName: finalRoom });
      if (!room) {
        room = await ChatRoom.create({
          roomName: finalRoom,
          roomType: "direct",
          members: [user._id],
          adminId: socket.adminId,
        });
      }

      const msg = await Message.create({
        roomId: room._id,
        senderId: user._id,
        senderName: user.name,
        text,
      });

      io.to(finalRoom).emit("chat-receive", msg);
    });

    // =============================
    // ⭐ ADMIN BROADCAST (only inside college)
    // =============================
    socket.on("admin-broadcast", async ({ target, text }) => {
      if (user.role !== "admin") return;

      let finalRoom = `${target}_${socket.adminId}`;

      io.to(finalRoom).emit("chat-broadcast-receive", {
        senderName: "ADMIN",
        text,
        createdAt: new Date(),
      });

      console.log("📢 Broadcast:", finalRoom);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

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
