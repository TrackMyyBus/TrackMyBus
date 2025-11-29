// DriverDashboard.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaRoute,
  FaBusAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCog,
  FaKey,
} from "react-icons/fa";

import Map from "@/components/Map";
import "leaflet/dist/leaflet.css";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [tripStarted, setTripStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [busLocation, setBusLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const [driver, setDriver] = useState(null);
  const [bus, setBus] = useState(null);
  const [route, setRoute] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const driverUserId = user?.userId;

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeTab");
    navigate("/");
  };

  // FETCH DRIVER DASHBOARD DATA
  useEffect(() => {
    if (!driverUserId) return;

    const loadDashboard = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/drivers/dashboard/${driverUserId}`
        );
        const data = await res.json();

        if (data.success) {
          setDriver(data.dashboard.driver);
          setBus(data.dashboard.bus);
          setRoute(data.dashboard.route);
        }
      } catch (err) {
        console.error("Driver dashboard error:", err);
      }
    };

    loadDashboard();
  }, [driverUserId]);

  // TRIP CONTROL
  const handleTripToggle = () => {
    if (!tripStarted) {
      setTripStarted(true);
      simulateTripProgress();
    } else {
      setTripStarted(false);
      setProgress(0);
      stopSharingLocation();
    }
  };

  const simulateTripProgress = () => {
    let current = 0;
    const timer = setInterval(() => {
      if (current >= 100 || !tripStarted) clearInterval(timer);
      else {
        current += 10;
        setProgress(current);
      }
    }, 1000);
  };

  // LIVE GPS SHARING
  const notifyBackendStartSharing = async () => {
    try {
      await fetch("http://localhost:5000/api/bus-location/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: driver?._id, busId: bus?._id }),
      });
    } catch (err) {
      console.error("Failed to notify backend:", err);
    }
  };

  const startSharingLocation = () => {
    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setBusLocation({ latitude, longitude });

          if (!bus?._id) return;

          try {
            await fetch("http://localhost:5000/api/bus-location/update", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ busId: bus._id, latitude, longitude }),
            });
          } catch (err) {
            console.error("Failed to update location:", err);
          }
        },
        (err) => console.error("GPS error:", err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      setWatchId(id);
      setSharing(true);
    } else {
      alert("Geolocation not supported!");
    }
  };

  const stopSharingLocation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setSharing(false);
  };

  useEffect(() => {
    if (!tripStarted) stopSharingLocation();
  }, [tripStarted]);

  // UI
  return (
    <div className="h-auto min-h-screen bg-gradient-to-br from-yellow-50 to-white px-3 py-4 sm:px-6 sm:py-8 pb-40 overflow-y-visible">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 relative">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900">
          Driver Dashboard
        </h1>

        <div className="flex items-center gap-2">
          {/* OPEN CHAT BUTTON */}
          <button
            onClick={() => navigate("/chat")}
            className="px-3 py-2 bg-indigo-900 text-white rounded"
          >
            Open Chat
          </button>

          {/* SETTINGS ICON */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-indigo-100 transition"
          >
            <FaCog className="text-indigo-900 text-xl sm:text-2xl" />
          </button>
        </div>

        {/* DROPDOWN MENU */}
        {isMenuOpen && (
          <div className="absolute right-0 top-12 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => navigate("/update-password")}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 text-indigo-800"
            >
              <FaKey /> Reset Password
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ROUTE CARD */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaRoute /> Assigned Route
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-slate-600">
            <p>
              <strong>Bus:</strong> {bus?.busNumberPlate || "Loading..."}
            </p>

            <p>
              <strong>Route:</strong> {route?.routeName || "Loading..."}
            </p>

            <p>
              <strong>Stops:</strong>{" "}
              {route?.stops?.map((s) => s.name).join(" → ") || "Loading..."}
            </p>
          </CardContent>
        </Card>

        {/* TRIP CONTROL */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaBusAlt /> Trip Control
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Trip Status:</p>
              <Badge
                variant={tripStarted ? "default" : "secondary"}
                className={tripStarted ? "bg-green-500" : "bg-gray-400"}
              >
                {tripStarted ? "Ongoing" : "Not Started"}
              </Badge>
            </div>

            <Progress value={progress} className="h-3" />

            <Button
              onClick={handleTripToggle}
              className={`w-full ${
                tripStarted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {tripStarted ? "End Trip" : "Start Trip"}
            </Button>

            {/* Sharing Switch */}
            <div className="flex items-center justify-between mt-4">
              <p>Enable Live Sharing</p>

              <Switch
                checked={sharing}
                disabled={!tripStarted}
                onCheckedChange={async (checked) => {
                  if (checked) {
                    await notifyBackendStartSharing();
                    startSharingLocation();
                  } else {
                    stopSharingLocation();
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* NOTIFICATIONS */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaBell /> Notifications
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-slate-600">
            <p>No notifications yet</p>
          </CardContent>
        </Card>
      </div>

      {/* MAP */}
      <Card className="mt-8 shadow-lg border-none col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <FaMapMarkerAlt /> Live Bus Location
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Map location={busLocation} height="300px" />
        </CardContent>
      </Card>

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 bg-indigo-50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between shadow-md gap-2"
      >
        <div className="flex items-center gap-2 text-indigo-900 font-medium">
          <FaRegClock />
          {tripStarted ? "Trip in progress..." : "Awaiting trip start"}
        </div>

        <span className="text-slate-600 text-sm">
          Driver ID: {driver?.driverId || "Loading..."}
        </span>
      </motion.div>
    </div>
  );
}
