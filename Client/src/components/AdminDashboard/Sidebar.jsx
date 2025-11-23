import React, { useContext, useEffect, useState } from "react";
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
  FaKey,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);

  // Make sidebar responsive & persistent
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("sidebarOpen")) ?? true
      : true
  );

  // Save sidebar state in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaUserCog /> },
    { key: "students", label: "Students", icon: <FaUsers /> },
    { key: "drivers", label: "Drivers", icon: <FaUserCog /> },
    { key: "buses", label: "Buses", icon: <FaBus /> },
    { key: "routes", label: "Routes", icon: <FaRoute /> },
    { key: "notifications", label: "Notifications", icon: <FaBell /> },
    { key: "chat", label: "Chat", icon: <FaComments /> },
    { key: "busLocations", label: "Bus Locations", icon: <FaMapMarkerAlt /> },
  ];

  const handleLogout = () => {
    logoutUser(); // clears user & token
    setActiveTab("dashboard"); // optional: reset active tab
    navigate("/");
  };

  return (
    <aside
      className={`bg-white shadow-lg fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu */}
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

        {/* Footer */}
        <div className="p-2 border-t">
          <button
            onClick={() => navigate("/update-password")}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-yellow-100 text-yellow-600 transition-colors">
            <FaKey />
            {sidebarOpen && "Reset Password"}
          </button>
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
