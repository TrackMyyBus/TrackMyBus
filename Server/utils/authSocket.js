// utils/authSocket.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export async function getUserFromSocketToken(token) {
  try {
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).lean();
    if (!user) user = await Admin.findById(decoded.id).lean();
    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: decoded.role,
      busId: user.busId ?? null,
    };
  } catch (err) {
    return null;
  }
}
