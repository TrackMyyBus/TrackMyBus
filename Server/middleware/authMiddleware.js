import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ⭐ Attach admin document if the user is admin
    if (req.user.role === "admin") {
      const admin = await Admin.findOne({ user: req.user._id });

      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      req.admin = admin;
    }

    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
};
