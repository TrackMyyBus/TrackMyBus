import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // correct import

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login API call later
    console.log(form);
  };

  return (
    <div
      id="login"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
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
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition">
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-slate-600">
          <Link
            to="/update-password"
            className="text-yellow-500 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-yellow-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
