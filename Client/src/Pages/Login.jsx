import React, { useState, useContext } from "react";
import axios from "axios";
import { VITE_API_BASE_URL } from "@/config/api";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
      const res = await axios.post(`${VITE_API_BASE_URL}/api/auth/login`, form);

      const { userData, token } = res.data;

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

      const role = userData.role?.toLowerCase().trim();

      navigate(role === "admin" ? "/admin" : `/${role}`);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div className="bg-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-yellow-500 text-white p-2 rounded">
            Login
          </button>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Forgot your password?{" "}
              <Link
                to="/update-password"
                className="text-yellow-500 hover:underline"
              >
                Reset Password
              </Link>
            </p>

            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-yellow-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
