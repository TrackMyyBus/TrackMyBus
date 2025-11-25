import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaUserCog, FaBus, FaRoute } from "react-icons/fa";

export default function DashboardOverview({ stats, chart }) {
  const safeStats = {
    totalStudents: stats?.totalStudents || 0,
    totalDrivers: stats?.totalDrivers || 0,
    totalBuses: stats?.totalBuses || 0,
    activeRoutes: stats?.activeRoutes || 0,
  };

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

  const barData = [
    { name: "Students", count: safeStats.totalStudents, fill: "#eab308" },
    { name: "Drivers", count: safeStats.totalDrivers, fill: "#3b82f6" },
    { name: "Buses", count: safeStats.totalBuses, fill: "#22c55e" },
    { name: "Routes", count: safeStats.activeRoutes, fill: "#9333ea" },
  ];

  return (
    <div className="ml-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Admin Dashboard
        </h1>
      </div>

      {/* STAT CARDS */}
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

      {/* BAR CHART */}
      <div className="bg-white shadow rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">System Overview</h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData} barSize={55}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
