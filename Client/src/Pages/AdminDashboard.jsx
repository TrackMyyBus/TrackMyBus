import React, { useState, useEffect } from "react";
import axios from "axios";

// Components
import Sidebar from "@/components/AdminDashboard/Sidebar";
import DashboardOverview from "@/components/AdminDashboard/DashboardOverview";
import ResponsiveTable from "@/components/AdminDashboard/ResponsiveTable";
import RoutesSection from "@/components/AdminDashboard/RoutesSection";
import NotificationsSection from "@/components/AdminDashboard/NotificationsSection";
import ChatSection from "@/components/AdminDashboard/ChatSection";
import BusLocationPage from "@/components/AdminDashboard/BusLocationPage";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("activeTab") || "dashboard"
      : "dashboard"
  );

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStudents(data.students || []);
        setDrivers(data.drivers || []);
        setBuses(data.buses || []);
        setRoutes(data.routes || []);

        const chartData = [
          { category: "Students", count: data.students?.length || 0 },
          { category: "Drivers", count: data.drivers?.length || 0 },
          { category: "Buses", count: data.buses?.length || 0 },
          { category: "Routes", count: data.routes?.length || 0 },
        ];

        setDashboardData({
          stats: {
            totalStudents: data.students?.length || 0,
            totalDrivers: data.drivers?.length || 0,
            totalBuses: data.buses?.length || 0,
            activeRoutes: data.routes?.length || 0,
          },
          chart: chartData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboard();
  }, [token]);

  // Routes CRUD
  const fetchRoutes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(data);
    } catch (err) {
      console.error("Failed to fetch routes:", err);
    }
  };

  const createRouteAPI = async (routeData) => {
    try {
      await axios.post("http://localhost:5000/api/routes", routeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  const updateRouteAPI = async (routeId, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/routes/${routeId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRouteAPI = async (routeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/${routeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  const assignBusAPI = async (routeId, busId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/routes/assign",
        { routeId, busId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRoutes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-4 md:p-6">
        {activeTab === "dashboard" && (
          <DashboardOverview
            stats={dashboardData?.stats}
            chart={dashboardData?.chart}
          />
        )}

        {activeTab === "students" && (
          <ResponsiveTable
            type="Student"
            data={students}
            buses={buses}
            drivers={drivers}
            routes={routes}
          />
        )}

        {activeTab === "drivers" && (
          <ResponsiveTable
            type="Driver"
            data={drivers}
            buses={buses}
            drivers={drivers}
            routes={routes}
          />
        )}

        {activeTab === "buses" && (
          <ResponsiveTable
            type="Bus"
            data={buses}
            buses={buses}
            drivers={drivers}
            routes={routes}
          />
        )}

        {activeTab === "routes" && (
          <RoutesSection
            data={routes}
            createRoute={createRouteAPI}
            updateRoute={updateRouteAPI}
            deleteRoute={deleteRouteAPI}
            assignBus={assignBusAPI}
          />
        )}

        {activeTab === "notifications" && <NotificationsSection data={[]} />}

        {activeTab === "chat" && <ChatSection data={[]} />}

        {activeTab === "busLocations" && (
          <BusLocationPage sidebarOpen={sidebarOpen} />
        )}
      </main>
    </div>
  );
}
