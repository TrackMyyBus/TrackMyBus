import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { transporter } from "../utils/email.js";

// Step 1: Send OTP
export const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        transporter.verify(function (error, success) {
            if (error) console.log("Email verification error:", error);
            else console.log("Server is ready to take messages");
        });


        await transporter.sendMail({
            from: `"TrackMyBus Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for Password Reset",
            text: `Your OTP is ${otp}. It expires in 10 minutes.`,
        });

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error("Error sending OTP:", err);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: err.message });
    }
};

// Step 2: Verify OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        if (!user.otp || !user.otpExpiresAt)
            return res
                .status(400)
                .json({ success: false, message: "No OTP found. Please request again." });

        if (user.otp !== otp)
            return res.status(400).json({ success: false, message: "Invalid OTP" });

        if (user.otpExpiresAt < new Date())
            return res.status(400).json({ success: false, message: "OTP expired" });

        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: err.message });
    }
};

// Step 3: Reset Password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();
        console.log("✅ Password reset for:", user.email);

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("❌ Error resetting password:", err);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

