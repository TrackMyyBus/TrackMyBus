import React, { useContext, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaUserCog,
  FaBus,
  FaRoute,
  FaSignOutAlt,
  FaKey,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(!!sidebarOpen));
  }, [sidebarOpen]);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaUserCog /> },
    { key: "students", label: "Students", icon: <FaUsers /> },
    { key: "drivers", label: "Drivers", icon: <FaUserCog /> },
    { key: "buses", label: "Buses", icon: <FaBus /> },
    { key: "routes", label: "Routes", icon: <FaRoute /> },
    { key: "busLocations", label: "Bus Locations", icon: <FaMapMarkerAlt /> },
  ];

  const handleLogout = () => {
    logoutUser();
    setActiveTab("dashboard");
    navigate("/");
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="sm:hidden fixed top-4 left-2  z-[1001]  bg-white px-3 py-2 rounded-md "
        onClick={() => setSidebarOpen((s) => !s)}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[1000] sm:hidden"
          onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
          hidden sm:flex flex-col
          fixed top-0 left-0 h-screen
          bg-white shadow-lg z-[999]
          transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-16"}
        `}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {sidebarOpen && <span className="font-bold text-xl">Admin</span>}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-1 rounded hover:bg-gray-100">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 w-full p-2 rounded hover:bg-yellow-50 transition-colors text-left ${
                activeTab === item.key ? "bg-yellow-50" : ""
              }`}>
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t">
          <button
            onClick={() => navigate("/update-password")}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-yellow-50 text-yellow-600 transition-colors">
            <FaKey />
            {sidebarOpen && "Reset Password"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-50 text-red-600 transition-colors mt-2">
            <FaSignOutAlt />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* MOBILE SLIDING SIDEBAR */}
      <aside
        className={`
          sm:hidden fixed inset-y-0 left-0 z-[1001]
          bg-white shadow-lg transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-72
        `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <span className="font-bold text-xl">Admin</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded">
              <FaTimes />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full p-2 rounded hover:bg-yellow-50 transition-colors ${
                  activeTab === item.key ? "bg-yellow-50" : ""
                }`}>
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-2 border-t">
            <button
              onClick={() => navigate("/update-password")}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-yellow-50 text-yellow-600 transition-colors">
              <FaKey />
              <span>Reset Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-red-50 text-red-600 transition-colors mt-2">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
