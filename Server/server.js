// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

/* ------------------------------------------------------------------
   MODELS
------------------------------------------------------------------ */
import Driver from "./models/Driver.js";
import Bus from "./models/Bus.js";
import BusLocation from "./models/BusLocation.js";

/* ------------------------------------------------------------------
   ROUTES
------------------------------------------------------------------ */
import authRoutes from "./routes/auth.js";
import passwordRoutes from "./routes/password.js";
import studentRoutes from "./routes/student.js";
import driverRoutes from "./routes/driver.js";
import busRoutes from "./routes/bus.js";
import routeRoutes from "./routes/route.js";
import adminRoutes from "./routes/admin.js";
import locationRoutes from "./routes/location.js";
import geocodeRoutes from "./routes/geocode.js";

/* ------------------------------------------------------------------
   EXPRESS APP + MIDDLEWARE
------------------------------------------------------------------ */
const app = express();

app.use(
  cors({
    origin: "*", // supports localhost, DevTunnel, mobile
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ------------------------------------------------------------------
   HTTP + SOCKET.IO SERVER
------------------------------------------------------------------ */
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* ------------------------------------------------------------------
   ALLOW CONTROLLERS TO ACCESS io
------------------------------------------------------------------ */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* ============================================================
   SOCKET.IO EVENTS
============================================================ */
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  /* ---------------------------------------------
     DRIVER STARTS LOCATION SHARING
  --------------------------------------------- */
  socket.on("driver-start", async ({ driverId, busId }) => {
    try {
      await Driver.findByIdAndUpdate(driverId, {
        socketId: socket.id,
        isSharingLocation: true,
      });

      await Bus.findByIdAndUpdate(busId, {
        trackingStatus: "online",
      });

      console.log(`🚍 Driver ${driverId} started sharing location`);
    } catch (err) {
      console.log("driver-start error:", err);
    }
  });

  /* ---------------------------------------------
     DRIVER LIVE LOCATION
  --------------------------------------------- */
  socket.on("driver-location", async (data) => {
    const { busId, driverId, latitude, longitude, speed, heading, battery } =
      data;

    try {
      // Update Bus
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

      // Store history
      await BusLocation.create({
        bus: busId,
        driver: driverId,
        latitude,
        longitude,
        speed,
        heading,
        battery,
        status: speed > 0 ? "moving" : "stopped",
        timestamp: new Date(),
      });

      // Send to admin + students
      io.emit(`bus-${busId}-location`, {
        latitude,
        longitude,
        speed,
        heading,
        battery,
      });
    } catch (err) {
      console.log("driver-location error:", err);
    }
  });

  /* ---------------------------------------------
     CHAT ROOMS
  --------------------------------------------- */
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("chatMessage", async (msg) => {
    try {
      await ChatMessage.create(msg);
      io.to(msg.roomId).emit("newChatMessage", msg);
    } catch (err) {
      console.log("chatMessage error:", err);
    }
  });

  /* ---------------------------------------------
     DISCONNECT
  --------------------------------------------- */
  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

/* ============================================================
   ROUTES
============================================================ */
app.get("/", (req, res) => res.send("TrackMyBus backend running"));

app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/geocode", geocodeRoutes);

/* ============================================================
   DATABASE
============================================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => console.error(err));

/* ============================================================
   START SERVER
============================================================ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
