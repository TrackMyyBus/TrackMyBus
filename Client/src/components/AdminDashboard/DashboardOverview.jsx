import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserCog, FaBus, FaRoute } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", students: 10, buses: 2 },
  { month: "Feb", students: 15, buses: 3 },
  { month: "Mar", students: 18, buses: 4 },
  { month: "Apr", students: 20, buses: 5 },
];

export default function DashboardOverview() {
  const stats = [
    {
      label: "Total Students",
      value: 20,
      icon: <FaUsers />,
      color: "text-yellow-500",
    },
    {
      label: "Total Drivers",
      value: 5,
      icon: <FaUserCog />,
      color: "text-blue-500",
    },
    {
      label: "Total Buses",
      value: 5,
      icon: <FaBus />,
      color: "text-green-500",
    },
    {
      label: "Active Routes",
      value: 2,
      icon: <FaRoute />,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="ml-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Admin Dashboard
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white shadow rounded-xl p-6 text-center border border-gray-100">
            <div className={`flex justify-center text-3xl mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Activity Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#facc15"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="buses"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
