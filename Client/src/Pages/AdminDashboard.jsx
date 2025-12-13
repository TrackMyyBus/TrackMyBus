import React, { useContext, useState, useEffect } from "react";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import DashboardOverview from "@/components/AdminDashboard/DashboardOverview";
import ResponsiveTable from "@/components/AdminDashboard/ResponsiveTable";
import RoutesSection from "@/components/AdminDashboard/RoutesSection";
import BusLocationPage from "@/components/AdminDashboard/BusLocationPage";

import { AuthContext } from "../contexts/AuthContext";
import useAdminData from "@/hooks/useAdminData";
import { VITE_API_BASE_URL } from "@/config/api";
import io from "socket.io-client";

const socket = io(VITE_API_BASE_URL, {
  transports: ["websocket", "polling"],
});

export default function AdminDashboard() {
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

  /** -----------------------------
   * ⭐ Notifications State
   * ------------------------------ */
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!adminId) return;

    // Load notifications from backend
    const fetchNotes = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/notification/admin/${adminId}`
        );
        const data = await res.json();
        if (data.success) setNotifications(data.notes);
      } catch (err) {
        console.log("Notification fetch error:", err);
      }
    };

    fetchNotes();

    // Live Notifications (Socket.io)
    socket.on("new-notification", (note) => {
      // Only for admin or all
      if (
        note.receiverType === "all" ||
        (note.receiverType === "admin" && note.receiverId == adminId)
      ) {
        setNotifications((prev) => [note, ...prev]);
      }
    });

    return () => socket.off("new-notification");
  }, [adminId]);

  /** -----------------------------
   *  UI Protection
   * ------------------------------ */
  if (!adminId)
    return (
      <div className="p-6 text-xl text-red-500">
        ❌ Admin ID missing. Please log in again.
      </div>
    );

  if (loading) return <div className="p-6 text-xl">Loading dashboard…</div>;

  const mainClass = `
    flex-1 transition-all duration-300 min-h-screen 
    p-4 md:p-6 
    pl-14 ${sidebarOpen ? "sm:ml-72 md:ml-64" : "sm:ml-16 md:ml-16"}
  `;

  return (
    <div className="flex bg-gray-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className={mainClass}>
        {activeTab === "dashboard" && (
          <DashboardOverview
            stats={{
              totalStudents: overview?.studentsCount,
              totalDrivers: overview?.driversCount,
              totalBuses: overview?.busesCount,
              activeRoutes: overview?.routesCount,
            }}
            chart={[
              { category: "Students", count: overview?.studentsCount },
              { category: "Drivers", count: overview?.driversCount },
              { category: "Buses", count: overview?.busesCount },
              { category: "Routes", count: overview?.routesCount },
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

        {activeTab === "busLocations" && <BusLocationPage />}
      </main>
    </div>
  );
}
