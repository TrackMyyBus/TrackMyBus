import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().populate("user", "name email role");
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addAdmin = async (req, res) => {
    try {
        const { name, email, password, employeeId, contactNumber } = req.body;

        const user = await User.create({ name, email, password, role: "admin" });
        const admin = await Admin.create({ user: user._id, employeeId, contactNumber });

        res.status(201).json(await admin.populate("user", "name email role"));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
