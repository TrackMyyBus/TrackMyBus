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
  FaKey,
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab");
    navigate("/");
  };

  return (
    <aside
      className={`bg-white shadow-lg fixed  md:relative z-40 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
          <button className="" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
