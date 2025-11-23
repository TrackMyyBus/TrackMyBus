import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaUserCog, FaBus, FaRoute } from "react-icons/fa";

export default function DashboardOverview({ stats, chart }) {
  // Provide defaults if props are missing
  const safeStats = stats || {
    totalStudents: 0,
    totalDrivers: 0,
    totalBuses: 0,
    activeRoutes: 0,
  };
  const safeChart = chart || [
    { month: "Jan", students: 0, buses: 0 },
    { month: "Feb", students: 0, buses: 0 },
    { month: "Mar", students: 0, buses: 0 },
    { month: "Apr", students: 0, buses: 0 },
  ];

  const icons = [<FaUsers />, <FaUserCog />, <FaBus />, <FaRoute />];
  const colors = [
    "text-yellow-500",
    "text-blue-500",
    "text-green-500",
    "text-purple-500",
  ];
  const labels = [
    "Total Students",
    "Total Drivers",
    "Total Buses",
    "Active Routes",
  ];
  const values = [
    safeStats.totalStudents,
    safeStats.totalDrivers,
    safeStats.totalBuses,
    safeStats.activeRoutes,
  ];

  return (
    <div className="ml-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {labels.map((label, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow rounded-xl p-6 text-center border border-gray-100">
            <div className={`flex justify-center text-3xl mb-3 ${colors[i]}`}>
              {icons[i]}
            </div>
            <div className="text-gray-600 font-medium">{label}</div>
            <div className="text-3xl font-bold">{values[i]}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Activity Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
