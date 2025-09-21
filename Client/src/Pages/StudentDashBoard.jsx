// src/Pages/StudentDashboard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-8">
      <h1 className="text-3xl font-extrabold text-indigo-900 mb-6">
        Student Dashboard
      </h1>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow h-96 mb-6 flex items-center justify-center text-slate-500">
        [Live Bus Map Placeholder]
      </motion.div>

      {/* Route Info & Notifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="font-bold text-indigo-900 mb-2">Route Details</h2>
          <p className="text-slate-500">[Route info placeholder]</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="font-bold text-indigo-900 mb-2">Notifications</h2>
          <p className="text-slate-500">[Alerts placeholder]</p>
        </motion.div>
      </div>
    </div>
  );
}
