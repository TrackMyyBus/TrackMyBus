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

// Models for tracking
import Driver from "./models/Driver.js";
import Bus from "./models/Bus.js";
import BusLocation from "./models/BusLocation.js";

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
// ✅ SOCKET.IO IMPLEMENTATION FOR REAL-TIME TRACKING
// ============================================================

io.on("connection", (socket) => {
  console.log("🟢 Driver/Client connected:", socket.id);

  // 1️⃣ DRIVER STARTS SHARING LOCATION
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

    } catch (err) {
      console.error("Error in driver-start:", err);
    }
  });

  // 2️⃣ DRIVER SENDING LIVE LOCATION
  socket.on("driver-location", async (data) => {
    const {
      driverId,
      busId,
      latitude,
      longitude,
      speed,
      heading,
      battery
    } = data;

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

      // Broadcast live update to students
      io.emit(`bus-${busId}-location`, {
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

  // 3️⃣ DRIVER DISCONNECTS
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

// ============================================================
// ✅ MONGODB CONNECTION
// ============================================================

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

// ============================================================
// ✅ START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

