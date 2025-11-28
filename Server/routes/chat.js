// routes/chat.js
import express from "express";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get rooms of logged-in user
router.get("/rooms", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const rooms = await ChatRoom.find({ members: userId }).lean();

    // If user has busId → include bus room
    if (req.user.busId) {
      const busRoomName = `bus_${req.user.busId}`;
      const busRoom = await ChatRoom.findOne({ roomName: busRoomName }).lean();
      if (busRoom && !rooms.some((r) => r.roomName === busRoom.roomName)) {
        rooms.push(busRoom);
      }
    }

    res.json(rooms);
  } catch (err) {
    console.error("❌ Error fetching rooms:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get message history
router.get("/history/:roomName", protect, async (req, res) => {
  try {
    const { roomName } = req.params;
    const room = await ChatRoom.findOne({ roomName });

    if (!room) return res.json([]);

    const msgs = await Message.find({ roomId: room._id }).sort({
      createdAt: 1,
    });
    res.json(msgs);
  } catch (err) {
    console.error("❌ Error loading messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
