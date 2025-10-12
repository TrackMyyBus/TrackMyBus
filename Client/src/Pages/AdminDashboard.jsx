// src/Pages/AdminDashboard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBus,
  FaUserCog,
  FaRoute,
  FaBell,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  students,
  drivers,
  buses,
  routes,
  notifications,
} from "@/lib/mock-data";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "<" : ">"}
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: <FaUserCog /> },
              { key: "students", label: "Students", icon: <FaUsers /> },
              { key: "drivers", label: "Drivers", icon: <FaUserCog /> },
              { key: "buses", label: "Buses", icon: <FaBus /> },
              { key: "routes", label: "Routes", icon: <FaRoute /> },
              {
                key: "notifications",
                label: "Notifications",
                icon: <FaBell />,
              },
              { key: "chat", label: "Chat", icon: <FaComments /> },
            ].map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-2 w-full p-2 rounded hover:bg-yellow-100 ${
                  activeTab === item.key ? "bg-yellow-100" : ""
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                {sidebarOpen && item.label}
              </button>
            ))}
          </nav>

          <div className="p-2 border-t">
            <button className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-100 text-red-600">
              <FaSignOutAlt />
              {sidebarOpen && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "students" && <EditableTable data={students} />}
        {activeTab === "drivers" && <EditableTable data={drivers} />}
        {activeTab === "buses" && <EditableTable data={buses} />}
        {activeTab === "routes" && <RoutesSection />}
        {activeTab === "notifications" && <NotificationsSection />}
        {activeTab === "chat" && <ChatSection />}
      </main>
    </div>
  );
}

// Dashboard overview cards
function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div className="bg-white shadow rounded-lg p-6 text-center">
        <div className="text-gray-500">Total Students</div>
        <div className="text-2xl font-bold text-yellow-500">20</div>
      </motion.div>
      <motion.div className="bg-white shadow rounded-lg p-6 text-center">
        <div className="text-gray-500">Total Drivers</div>
        <div className="text-2xl font-bold text-yellow-500">5</div>
      </motion.div>
      <motion.div className="bg-white shadow rounded-lg p-6 text-center">
        <div className="text-gray-500">Total Buses</div>
        <div className="text-2xl font-bold text-yellow-500">5</div>
      </motion.div>
      <motion.div className="bg-white shadow rounded-lg p-6 text-center">
        <div className="text-gray-500">Active Routes</div>
        <div className="text-2xl font-bold text-yellow-500">2</div>
      </motion.div>
    </div>
  );
}

// Editable table for students/drivers/buses
function EditableTable({ data }) {
  const [rows, setRows] = useState(data);

  const handleChange = (id, key, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4 mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-100">
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, idx) => (
            <tr key={idx}>
              {Object.keys(row).map((key) => (
                <td className="px-6 py-3" key={key}>
                  <input
                    value={row[key]}
                    onChange={(e) => handleChange(row.id, key, e.target.value)}
                    className="border px-2 py-1 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </td>
              ))}
              <td className="px-6 py-3">
                <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Routes section
function RoutesSection() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Routes</h2>
      <ul className="space-y-4">
        {Object.values(routes).map((route) => (
          <li key={route.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold">{route.name}</h3>
            <p className="text-gray-500">Stops:</p>
            <ul className="list-disc pl-6">
              {route.stops.map((stop, idx) => (
                <li key={idx}>{stop.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Notifications section
function NotificationsSection() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-3">
        {notifications.admin.map((note) => (
          <li
            key={note.id}
            className={`p-3 rounded shadow-sm ${
              note.type === "alert" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <p className="font-medium">{note.message}</p>
            <span className="text-xs text-gray-500">{note.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Chat section
function ChatSection() {
  const [messages, setMessages] = useState([
    { sender: "Admin", text: "Hello team, update me on Bus 101" },
    { sender: "Driver", text: "Bus 101 is on time." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "You", text: input }]);
    setInput("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col h-[70vh]">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="flex-1 overflow-y-auto space-y-2 border p-3 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.sender === "You" ? "bg-yellow-100 text-right" : "bg-gray-100"
            }`}
          >
            <p className="text-sm">
              <span className="font-semibold">{msg.sender}:</span> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex mt-3">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-yellow-500 text-white px-4 rounded-r hover:bg-yellow-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
