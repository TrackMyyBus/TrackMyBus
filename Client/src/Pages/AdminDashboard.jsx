import React, { useContext, useState, useEffect } from "react";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import DashboardOverview from "@/components/AdminDashboard/DashboardOverview";
import ResponsiveTable from "@/components/AdminDashboard/ResponsiveTable";
import RoutesSection from "@/components/AdminDashboard/RoutesSection";
import NotificationsSection from "@/components/AdminDashboard/NotificationsSection";
import ChatSection from "@/components/AdminDashboard/ChatSection";
import BusLocationPage from "@/components/AdminDashboard/BusLocationPage";

import { AuthContext } from "../contexts/AuthContext";
import useAdminData from "@/hooks/useAdminData";

import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  // ⭐ FIX: useNavigate MUST be inside component
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const adminId =
    user?.adminId || localStorage.getItem("adminId") || user?._id || null;

  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "dashboard"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const [sidebarOpen, setSidebarOpen] = useState(
    JSON.parse(localStorage.getItem("sidebarOpen")) ?? true
  );

  const { loading, overview, students, drivers, buses, routes, refreshAll } =
    useAdminData(adminId, token);

  if (!adminId) {
    return (
      <div className="p-6 text-xl text-red-500">
        ❌ Admin ID missing. Please log in again.
      </div>
    );
  }

  if (loading)
    return (
      <div className="p-6 text-xl font-bold text-gray-700">
        Loading dashboard...
      </div>
    );

  const mainClass = `
    flex-1 transition-all duration-300 min-h-screen 
    p-4 md:p-6 
    pl-14
    ${sidebarOpen ? "sm:ml-72 md:ml-64" : "sm:ml-16 md:ml-16"}
  `;

  return (
    <div className="flex bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Chat Button (you can keep or move it to Sidebar) */}
      <button
        onClick={() => navigate("/chat")}
        className="px-4 py-2 bg-blue-600 text-white rounded absolute right-4 top-4"
      >
        Open Chat
      </button>

      <main className={mainClass}>
        {activeTab === "dashboard" && (
          <DashboardOverview
            stats={{
              totalStudents: overview?.studentsCount || 0,
              totalDrivers: overview?.driversCount || 0,
              totalBuses: overview?.busesCount || 0,
              activeRoutes: overview?.routesCount || 0,
            }}
            chart={[
              { category: "Students", count: overview?.studentsCount || 0 },
              { category: "Drivers", count: overview?.driversCount || 0 },
              { category: "Buses", count: overview?.busesCount || 0 },
              { category: "Routes", count: overview?.routesCount || 0 },
            ]}
          />
        )}

        {activeTab === "students" && (
          <ResponsiveTable
            type="Student"
            data={students}
            buses={buses}
            drivers={drivers}
            routes={routes}
            refreshData={refreshAll}
          />
        )}

        {activeTab === "drivers" && (
          <ResponsiveTable
            type="Driver"
            data={drivers}
            buses={buses}
            drivers={drivers}
            routes={routes}
            refreshData={refreshAll}
          />
        )}

        {activeTab === "buses" && (
          <ResponsiveTable
            type="Bus"
            data={buses}
            buses={buses}
            drivers={drivers}
            routes={routes}
            refreshData={refreshAll}
          />
        )}

        {activeTab === "routes" && (
          <RoutesSection
            buses={buses}
            drivers={drivers}
            refreshRoutes={refreshAll}
          />
        )}

        {activeTab === "notifications" && <NotificationsSection />}

        {activeTab === "chat" && <ChatSection />}

        {activeTab === "busLocations" && <BusLocationPage />}
      </main>
    </div>
  );
}
