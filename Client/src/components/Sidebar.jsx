// src/components/Sidebar.jsx
import React from "react";
import {
  FaUsers,
  FaBus,
  FaUserCog,
  FaSignOutAlt,
  FaCogs,
} from "react-icons/fa";

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { key: "students", label: "Students", icon: <FaUsers /> },
    { key: "drivers", label: "Drivers", icon: <FaUserCog /> },
    { key: "buses", label: "Buses", icon: <FaBus /> },
    { key: "settings", label: "Settings", icon: <FaCogs /> },
    { key: "logout", label: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 h-full fixed md:relative flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-700 ${
              activeTab === item.key ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab(item.key)}>
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
