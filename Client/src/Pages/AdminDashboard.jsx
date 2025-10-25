import React, { useState, useEffect } from "react";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import DashboardOverview from "@/components/AdminDashboard/DashboardOverview";
import EditableTable from "@/components/AdminDashboard/EditableTable";
import RoutesSection from "@/components/AdminDashboard/RoutesSection";
import NotificationsSection from "@/components/AdminDashboard/NotificationsSection";
import ChatSection from "@/components/AdminDashboard/ChatSection";
import { students, drivers, buses } from "@/lib/mock-data";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "dashboard"
  );

  // Sidebar open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Handle window resize
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
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 transition-all duration-300">
        {activeTab === "dashboard" && <DashboardOverview />}
        {activeTab === "students" && (
          <EditableTable data={students} type="Students" />
        )}
        {activeTab === "drivers" && (
          <EditableTable data={drivers} type="Drivers" />
        )}
        {activeTab === "buses" && <EditableTable data={buses} type="Buses" />}
        {activeTab === "routes" && <RoutesSection />}
        {activeTab === "notifications" && <NotificationsSection />}
        {activeTab === "chat" && <ChatSection />}
      </main>
    </div>
  );
}
