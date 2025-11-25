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

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  /* --------------------------------------------------
   * 1. Extract adminId safely (3 fallback layers)
   * -------------------------------------------------- */
  const adminId =
    user?.adminId || localStorage.getItem("adminId") || user?._id || null;

  const token = localStorage.getItem("token");

  /* --------------------------------------------------
   * 2. Active Tab (saved in localStorage)
   * -------------------------------------------------- */
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "dashboard"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  /* --------------------------------------------------
   * 3. Fetch all dashboard data
   * -------------------------------------------------- */
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ----------------------------------------- */}
      {/* Sidebar */}
      {/* ----------------------------------------- */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ----------------------------------------- */}
      {/* MAIN CONTENT */}
      {/* ----------------------------------------- */}
      <main className="flex-1 p-4 md:p-6 ml-16">
        {/* ----------------------------------------- */}
        {/* TAB: Dashboard Overview */}
        {/* ----------------------------------------- */}
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

        {/* ----------------------------------------- */}
        {/* TAB: Students */}
        {/* ----------------------------------------- */}
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

        {/* ----------------------------------------- */}
        {/* TAB: Drivers */}
        {/* ----------------------------------------- */}
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

        {/* ----------------------------------------- */}
        {/* TAB: Buses */}
        {/* ----------------------------------------- */}
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

        {/* ----------------------------------------- */}
        {/* TAB: Routes */}
        {/* ----------------------------------------- */}
        {activeTab === "routes" && (
          <RoutesSection
            buses={buses}
            drivers={drivers}
            refreshRoutes={refreshAll}
          />
        )}

        {/* ----------------------------------------- */}
        {/* TAB: Notifications */}
        {/* ----------------------------------------- */}
        {activeTab === "notifications" && (
          <NotificationsSection adminId={adminId} />
        )}

        {/* ----------------------------------------- */}
        {/* TAB: Chat */}
        {/* ----------------------------------------- */}
        {activeTab === "chat" && <ChatSection adminId={adminId} />}

        {/* ----------------------------------------- */}
        {/* TAB: Live Bus Locations */}
        {/* ----------------------------------------- */}
        {activeTab === "busLocations" && <BusLocationPage />}
      </main>
    </div>
  );
}
