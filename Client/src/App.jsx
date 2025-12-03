// src/App.jsx
import "./App.css";
import "./index.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import UpdatePassword from "./Pages/UpdatePassword";
import AdminDashboard from "./Pages/AdminDashboard";
import DriverDashboard from "./Pages/DriverDashboard";
import StudentDashboard from "./Pages/StudentDashBoard";

// PWA UI
import PWAInstallButton from "./components/PWAInstallButton";
import PWAInstallBanner from "./components/PWAInstallBanner";

// Auth
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  /* --------------------------------------------
     🌐 Offline / Online Banner Logic
  --------------------------------------------- */
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineMessage(true);
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* 🔴 OFFLINE BANNER */}
      {isOffline && (
        <div className="offline-banner bg-red-600 text-white text-center py-2 text-sm">
          🔴 You are offline — showing last known data.
        </div>
      )}

      {/* 🟢 ONLINE BANNER */}
      {showOnlineMessage && (
        <div className="offline-banner bg-green-600 text-white text-center py-2 text-sm">
          🟢 You’re back online — syncing latest data...
        </div>
      )}

      {/* 📲 Install App Banner */}
      <PWAInstallBanner />

      {/* App Routes */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Driver */}
          <Route
            path="/driver"
            element={
              <PrivateRoute role="driver">
                <DriverDashboard />
              </PrivateRoute>
            }
          />

          {/* Student */}
          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>

      {/* Floating install button */}
      <PWAInstallButton />
    </>
  );
}
