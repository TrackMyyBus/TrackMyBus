// src/Pages/DriverDashboard.jsx
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
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCog,
  FaKey,
  FaPaperPlane,
  FaInbox,
} from "react-icons/fa";

import { API_BASE_URL } from "@/config/api";
import Map from "@/components/Map";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

const socket = io(API_BASE_URL, {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  timeout: 20000,
});

export default function DriverDashboard() {
  const navigate = useNavigate();

  /* --------------------------------------------
        LOCAL STATES
  -------------------------------------------- */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [busLocation, setBusLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const [driver, setDriver] = useState(null);
  const [bus, setBus] = useState(null);
  const [route, setRoute] = useState(null);

  const [notifications, setNotifications] = useState([]);

  // NEW - toggle UI
  const [showSendForm, setShowSendForm] = useState(false);

  // Notification form inputs
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [receiver, setReceiver] = useState("admin");

  const user = JSON.parse(localStorage.getItem("user"));
  const driverUserId = user?.userId;
  const instituteId = user?.institute;

  /* --------------------------------------------
        LOGOUT
  -------------------------------------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* --------------------------------------------
        LOAD DASHBOARD DETAILS
  -------------------------------------------- */
  useEffect(() => {
    if (!driverUserId) return;

    const loadDashboard = async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/drivers/dashboard/${driverUserId}`
      );
      const data = await res.json();

      if (data.success) {
        setDriver(data.dashboard.driver);
        setBus(data.dashboard.bus);
        setRoute(data.dashboard.route);
      }
    };

    loadDashboard();
  }, [driverUserId]);

  /* --------------------------------------------
        SOCKET: DRIVER ROOM + NOTIFICATIONS
  -------------------------------------------- */
  useEffect(() => {
    if (driver?._id) {
      socket.emit("joinRoom", `driver-${driver._id}`);

      socket.on("new-notification", (note) => {
        if (
          note.institute === instituteId &&
          (note.receiverType === "driver" ||
            note.receiverType === "all" ||
            note.receiverId === driverUserId)
        ) {
          setNotifications((prev) => [note, ...prev]);
        }
      });
    }

    return () => socket.off("new-notification");
  }, [driver]);

  /* --------------------------------------------
        TRIP PROGRESS
  -------------------------------------------- */
  const handleTripToggle = () => {
    if (!tripStarted) {
      setTripStarted(true);
      simulateTrip();
      startLocationSharing();
    } else {
      setTripStarted(false);
      setProgress(0);
      stopLocationSharing();
    }
  };

  const simulateTrip = () => {
    let current = 0;
    const timer = setInterval(() => {
      if (!tripStarted || current >= 100) {
        clearInterval(timer);
      } else {
        current += 10;
        setProgress(current);
      }
    }, 1000);
  };

  /* --------------------------------------------
        LOCATION SHARING
  -------------------------------------------- */
  const startLocationSharing = () => {
    if (!bus?._id) return alert("Bus not assigned!");

    socket.emit("driver-start", {
      driverId: driver._id,
      busId: bus._id,
    });

    if ("geolocation" in navigator) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, speed, heading } = pos.coords;

          setBusLocation({
            latitude: Number(latitude),
            longitude: Number(longitude),
          });

          socket.emit("driver-location", {
            driverId: driver._id,
            busId: bus._id,
            latitude,
            longitude,
            speed: speed || 0,
            heading: heading || 0,
            battery: 90,
          });
        },
        console.error,
        { enableHighAccuracy: true, timeout: 5000 }
      );

      setWatchId(id);
      setSharing(true);
    }
  };

  const stopLocationSharing = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setSharing(false);
  };

  /* --------------------------------------------
        SEND NOTIFICATION (REAL BACKEND)
  -------------------------------------------- */
  const sendNotification = async () => {
    if (!notifyTitle || !notifyMessage)
      return alert("Please fill title & message");

    const payload = {
      title: notifyTitle,
      message: notifyMessage,
      senderType: "driver",
      senderId: driverUserId,
      receiverType: receiver,
      institute: instituteId, // IMPORTANT
    };

    const res = await fetch(`${API_BASE_URL}/api/notification/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Notification sent!");
      setNotifyTitle("");
      setNotifyMessage("");
      setShowSendForm(false);
    }
  };

  /* --------------------------------------------
        UI STARTS HERE
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-6 sm:p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 relative">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Driver Dashboard
        </h1>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-indigo-100">
          <FaCog className="text-indigo-900 text-2xl" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-12 w-48 bg-white rounded-xl shadow-lg border z-50">
            <button
              onClick={() => navigate("/update-password")}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 text-indigo-800">
              <FaKey /> Reset Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROUTE CARD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaRoute /> Assigned Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <b>Bus:</b> {bus?.busNumberPlate}
            </p>
            <p>
              <b>Route:</b> {route?.routeName}
            </p>
            <p>
              <b>Stops:</b>{" "}
              {route?.stops?.map((s) => s.name).join(" → ") || "Loading..."}
            </p>
          </CardContent>
        </Card>

        {/* TRIP CONTROL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaBusAlt /> Trip Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={tripStarted ? "bg-green-500" : "bg-gray-400"}>
              {tripStarted ? "Ongoing" : "Not Started"}
            </Badge>

            <Progress value={progress} />

            <Button
              onClick={handleTripToggle}
              className={tripStarted ? "bg-red-500" : "bg-yellow-500"}>
              {tripStarted ? "End Trip" : "Start Trip"}
            </Button>

            <div className="flex items-center justify-between">
              <p>Enable Live Sharing</p>
              <Switch checked={sharing} onCheckedChange={setSharing} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAP */}
      <Card className="mt-8 mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <FaMapMarkerAlt /> Live Bus Location
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Map
            location={busLocation}
            busId={bus?._id}
            route={route}
            height="300px"
          />
        </CardContent>
      </Card>
    </div>
  );
}
