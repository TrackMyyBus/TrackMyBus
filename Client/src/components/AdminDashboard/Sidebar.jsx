// src/Components/Sidebar/Sidebar.jsx
import React from "react";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaUserCog,
  FaBus,
  FaRoute,
  FaBell,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
}) {
  const navigate = useNavigate();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaUserCog /> },
    { key: "students", label: "Students", icon: <FaUsers /> },
    { key: "drivers", label: "Drivers", icon: <FaUserCog /> },
    { key: "buses", label: "Buses", icon: <FaBus /> },
    { key: "routes", label: "Routes", icon: <FaRoute /> },
    { key: "notifications", label: "Notifications", icon: <FaBell /> },
    { key: "chat", label: "Chat", icon: <FaComments /> },
  ];

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    localStorage.removeItem("activeTab"); // Optional: Clear active tab
    navigate("/"); // Redirect to login page
  };

  return (
    <aside
      className={`bg-white shadow-lg transition-all duration-300 fixed md:relative h-full z-40 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`flex items-center gap-2 w-full p-2 rounded hover:bg-yellow-100 transition-colors ${
                activeTab === item.key ? "bg-yellow-100" : ""
              }`}
              onClick={() => setActiveTab(item.key)}>
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* ✅ Logout Button */}
        <div className="p-2 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-100 text-red-600 transition-colors">
            <FaSignOutAlt />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
}
