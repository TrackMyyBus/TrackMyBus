import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UpdatePassword() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter OTP, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Step 1: Send OTP
  const sendOTP = async () => {
    try {
      // Replace with your API call
      await axios.post("/api/otp/send-otp", { email });
      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async () => {
    try {
      // Replace with your API call
      const res = await axios.post("/api/otp/verify-otp", { email, otp });
      if (res.data.success) {
        setIsOtpVerified(true);
        setStep(3);
        alert("OTP verified! Now you can reset your password.");
      } else {
        alert("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
  };

  // Step 3: Reset Password
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      // Replace with your API call
      await axios.post("/api/auth/reset-password", {
        email,
        newPassword: form.newPassword,
      });
      alert("Password updated successfully!");
      setStep(1);
      setEmail("");
      setOtp("");
      setForm({ newPassword: "", confirmPassword: "" });
      setIsOtpVerified(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-extrabold text-indigo-900 mb-6 text-center">
          Update Password
        </h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <button
              onClick={sendOTP}
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition">
              Send OTP
            </button>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <button
              onClick={verifyOTP}
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition">
              Verify OTP
            </button>
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
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition">
              Update Password
            </button>
          </form>
        )}

        <p className="mt-4 text-sm text-center text-slate-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
