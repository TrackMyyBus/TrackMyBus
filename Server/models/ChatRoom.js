// Server/models/ChatRoom.js
import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
  roomName: { type: String, required: true, index: true }, // e.g., bus_101_adminId
  roomType: {
    type: String,
    enum: ["bus", "direct", "broadcast"],
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  adminId: { type: String }, // store institute/admin id for isolation
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ChatRoom", ChatRoomSchema);
