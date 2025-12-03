// Login.jsx

import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      // ⭐ Correct destructure
      const { userData, token } = res.data;

      // Save to localStorage (required for PrivateRoute)
      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.userId);

      // save busId for drivers/students
      // ⭐ Save adminId (institute) for all roles
      localStorage.setItem(
        "adminId",
        userData.profile.institute || userData.adminId || ""
      );

      // ⭐ Save busId correctly (using assignedBus)
      if (userData.role === "driver") {
        localStorage.setItem("driverBusId", userData.profile.assignedBus || "");
      }

      if (userData.role === "student") {
        localStorage.setItem(
          "studentBusId",
          userData.profile.assignedBus || ""
        );
      }

      // Save in AuthContext (optional)
      loginUser(
        {
          userId: userData.userId,
          role: userData.role,
          profile: userData.profile,
          adminId: userData.adminId,
        },
        token
      );

      alert("Login successful!");

      // Redirect based on role
      if (userData.role === "admin") navigate("/admin");
      else if (userData.role === "driver") navigate("/driver");
      else if (userData.role === "student") navigate("/student");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md"
      >
        <h2 className="text-2xl font-extrabold text-indigo-900 mb-6 text-center">
          Login
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-slate-600">
          <Link
            to="/update-password"
            className="text-yellow-500 hover:underline"
          >
            Forgot Password?
          </Link>

          <Link to="/signup" className="text-yellow-500 hover:underline">
            Admin Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
