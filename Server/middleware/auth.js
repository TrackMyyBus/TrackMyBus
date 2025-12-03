import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];

        console.log("🔐 Incoming Token:", token);

        if (!token) {
            console.log("❌ No token found in header");
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🧩 Decoded Token:", decoded);

        let user = await User.findById(decoded.id);
        if (!user) {
            console.log("🔍 Not found in User, checking Admin...");
            user = await Admin.findById(decoded.id);
        }

        console.log("👤 Found User/Admin:", user);

        if (!user) {
            console.log("❌ No user found in DB");
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        req.user.role = decoded.role;

        console.log("✅ Final req.user:", req.user);

        next();
    } catch (err) {
        console.error("❌ Auth error:", err);
        res.status(401).json({ message: "Unauthorized" });
    }
};



export const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};
