import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Signup Controller
// export const signup = async (req, res) => {
//     const { name, email, password, role } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser)
//             return res.status(400).json({ message: "User already exists" });

//         const user = await User.create({ name, email, password, role });
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         res.status(201).json({
//             token,
//             user: { id: user._id, name: user.name, role: user.role },
//         });
//     } catch (err) {
//         console.error("Signup Error:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

export const signup = async (req, res) => {
    const {
        instituteName,
        instituteCode,
        email,
        password,
        contactNumber,
        address,
        city,
        state,
        role,
    } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        // Hash password (optional, User schema also hashes it, but safe to pre-hash for Admin)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User (use instituteName as name for admins)
        const user = await User.create({
            name: role === "admin" ? instituteName : "", // default for other roles
            email,
            password: hashedPassword,
            role,
        });

        // If admin, create Admin document
        let admin = null;
        if (role === "admin") {
            admin = await Admin.create({
                instituteName,
                instituteCode,
                email,
                password: hashedPassword, // store hashed password
                contactNumber,
                address,
                city,
                state,
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: role === "admin" ? admin._id : user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                adminId: admin?._id || null,
            },
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


// Login Controller

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Fetch admin document if this user is admin
        let admin = null;
        if (user.role === "admin") {
            admin = await Admin.findOne({ email });
        }

        if (!user)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.role === "admin" ? admin._id : user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,       // User table ID
                adminId: admin?._id || null,   // IMPORTANT
                name: user.name,
                role: user.role
            },

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//logout

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: true });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
