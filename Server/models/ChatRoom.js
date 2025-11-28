// models/ChatRoom.js
import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, index: true }, // e.g., bus_101, admin_driver_abc
  roomType: {
    type: String,
    enum: ["bus", "direct", "broadcast"],
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ChatRoom", ChatRoomSchema);
