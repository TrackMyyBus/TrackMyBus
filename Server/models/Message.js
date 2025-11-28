// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
