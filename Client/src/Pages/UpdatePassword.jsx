import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { VITE_API_BASE_URL } from "@/config/api";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email → 2: OTP → 3: Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const baseURL = `${VITE_API_BASE_URL}/api/password`;

  // Step 1: Send OTP
  const sendOTP = async () => {
    if (!email) return alert("Please enter your email address.");

    try {
      const res = await axios.post(`${baseURL}/send-otp`, { email });
      if (res.data.success) {
        alert("OTP has been sent to your email!");
        setStep(2);
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      alert("Something went wrong while sending OTP.");
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async () => {
    if (!otp) return alert("Please enter the OTP sent to your email.");

    try {
      const res = await axios.post(`${baseURL}/verify-otp`, { email, otp });
      if (res.data.success) {
        setIsOtpVerified(true);
        setStep(3);
        alert("OTP verified successfully! You can now reset your password.");
      } else {
        alert(res.data.message || "Invalid OTP.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("Something went wrong while verifying OTP.");
    }
  };

  // Step 3: Reset Password
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const res = await axios.post(`${baseURL}/reset-password`, {
        email,
        newPassword: form.newPassword,
      });

      if (res.data.success) {
        alert("Password updated successfully! Please login.");
        // Redirect to login page
        navigate("/login");
      } else {
        alert(res.data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      alert("Something went wrong while updating password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md"
      >
        <h2 className="text-2xl font-extrabold text-indigo-900 mb-6 text-center">
          Update Password
        </h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={sendOTP}
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter the OTP received in email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <div className="flex gap-2">
              <button
                onClick={verifyOTP}
                className="flex-1 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition"
              >
                Verify OTP
              </button>
              <button
                onClick={sendOTP}
                className="flex-1 py-2 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-50 transition"
              >
                Resend
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && isOtpVerified && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition"
            >
              Update Password
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-center text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
