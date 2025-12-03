// routes/chat.js
import express from "express";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// CREATE OR FETCH ROOM SAFELY
async function getOrCreateRoom(roomName, roomType) {
  let room = await ChatRoom.findOne({ roomName });

  if (!room) {
    room = await ChatRoom.create({
      roomName,
      roomType, // must be "direct" | "bus" | "broadcast"
      members: [],
    });
  }

  return room;
}

// GET message history
router.get("/history/:roomName", protect, async (req, res) => {
  const adminId = req.user.adminId || req.user.institute;

  const finalRoom = `${req.params.roomName}_${adminId}`;

  const room = await ChatRoom.findOne({ roomName: finalRoom });
  if (!room) return res.json([]);

  const msgs = await Message.find({ roomId: room._id }).sort({ createdAt: 1 });
  res.json(msgs);
});

export default router;
