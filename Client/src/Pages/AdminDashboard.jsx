import React, { useState, useEffect } from "react";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import DashboardOverview from "@/components/AdminDashboard/DashboardOverview";
import ResponsiveTable from "@/components/AdminDashboard/ResponsiveTable";
import RoutesSection from "@/components/AdminDashboard/RoutesSection";
import NotificationsSection from "@/components/AdminDashboard/NotificationsSection";
import ChatSection from "@/components/AdminDashboard/ChatSection";
import BusLocationPage from "@/components/AdminDashboard/BusLocationPage";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "dashboard"
  );

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main
        className={`flex-1 p-2 sm:p-4 md:p-6 transition-all duration-300 flex flex-col min-h-screen ${
          sidebarOpen ? "md:ml-0" : "md:ml-16"
        }`}
      >
        {activeTab === "dashboard" && <DashboardOverview />}

        {activeTab === "students" && (
          <ResponsiveTable data={[]} type="Students" />
        )}

        {activeTab === "drivers" && (
          <ResponsiveTable data={[]} type="Drivers" />
        )}

        {activeTab === "buses" && <ResponsiveTable data={[]} type="Buses" />}

        {activeTab === "routes" && <RoutesSection />}
        {activeTab === "notifications" && <NotificationsSection />}
        {activeTab === "chat" && <ChatSection />}
        {activeTab === "busLocations" && <BusLocationPage />}
      </main>
    </div>
  );
}
