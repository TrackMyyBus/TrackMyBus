// authController.js

import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Driver from "../models/Driver.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ======================================================
// ADMIN SIGNUP (FIXED — NO DOUBLE-HASHING)
// ======================================================
export const signup = async (req, res) => {
    try {
        const {
            instituteName,
            instituteCode,
            email,
            password,
            contactNumber,
            address,
            city,
            state,
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        // ❌ REMOVE MANUAL HASHING
        // User model will hash automatically

        const user = await User.create({
            name: instituteName,
            email,
            password,   // RAW password → UserSchema pre("save") will hash
            role: "admin",
        });

        const admin = await Admin.create({
            userId: user._id,
            instituteName,
            instituteCode,
            contactNumber,
            address,
            city,
            state,
        });

        const token = jwt.sign(
            { id: user._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: true,
            message: "Admin Registered Successfully",
            token,
            userData: {
                userId: user._id,
                adminId: admin._id,
                role: "admin",
                profile: admin,
            },
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ======================================================
// LOGIN FOR ADMIN / STUDENT / DRIVER
// ======================================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        let profile = null;
        let adminId = null;

        // ADMIN
        if (user.role === "admin") {
            profile = await Admin.findOne({ userId: user._id });
            adminId = profile._id;

            const valid = await bcrypt.compare(password, user.password);
            if (!valid)
                return res.status(400).json({ message: "Invalid credentials" });

            return sendLoginSuccess(res, user, profile, adminId);
        }

        // STUDENT
        if (user.role === "student") {
            profile = await Student.findOne({ userId: user._id });
            if (!profile)
                return res.status(400).json({ message: "Student profile missing" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid)
                return res.status(400).json({ message: "Invalid credentials" });

            return sendLoginSuccess(res, user, profile, null);
        }

        // DRIVER
        if (user.role === "driver") {
            profile = await Driver.findOne({ userId: user._id });
            if (!profile)
                return res.status(400).json({ message: "Driver profile missing" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid)
                return res.status(400).json({ message: "Invalid credentials" });

            return sendLoginSuccess(res, user, profile, null);
        }

        return res.status(400).json({ message: "Invalid role" });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ======================================================
// REUSABLE LOGIN RESPONSE
// ======================================================
const sendLoginSuccess = (res, user, profile, adminId = null) => {
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        userData: {
            userId: user._id,
            adminId,
            role: user.role,
            profile,
        },
    });
};

// ======================================================
// LOGOUT
// ======================================================
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
