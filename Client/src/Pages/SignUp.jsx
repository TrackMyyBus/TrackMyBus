import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    instituteName: "",
    instituteCode: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    role: "admin",
  });

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return alert("Passwords do not match");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );

      // Save user and token using AuthContext
      loginUser(res.data.user, res.data.token);
      alert("Signup successful!");

      // Redirect based on role
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "driver") navigate("/driver");
      else if (res.data.user.role === "student") navigate("/student");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed. Try again.");
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
          Admin Signup
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="instituteName"
            placeholder="Institute Name"
            value={form.instituteName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="text"
            name="instituteCode"
            placeholder="Institute Code"
            value={form.instituteCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition">
            Sign Up
          </button>
        </form>
        <div className="flex justify-between mt-4 text-sm text-slate-600">
          <p className="text-yellow-500">Already have an account?</p>
          <Link to="/login" className="text-yellow-500 hover:underline">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
