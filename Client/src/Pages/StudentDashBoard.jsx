// StudentDashboard.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaBus,
  FaRoad,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCog,
  FaKey,
} from "react-icons/fa";

import { API_BASE_URL } from "@/config/api";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// SOCKET CONNECT
const socket = io(API_BASE_URL, {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  timeout: 20000,
});

export default function StudentDashboard() {
  const navigate = useNavigate();

  const studentUserId = localStorage.getItem("studentUserId");

  const [isTracking, setIsTracking] = useState(false);

  // Load last saved location from localStorage (PWA offline support)
  const [busLocation, setBusLocation] = useState(
    JSON.parse(localStorage.getItem("lastBusLocation")) || null
  );

  const [student, setStudent] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* -----------------------------------------------------------
     1) LOAD STUDENT DASHBOARD
  ----------------------------------------------------------- */
  useEffect(() => {
    if (!studentUserId) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/students/dashboard/${studentUserId}`
        );
        const data = await res.json();

        setStudent(data.student);
        setNotifications(data.notifications || []);

        if (data.student?.assignedBus) {
          const busId = data.student.assignedBus;

          loadBusInfo(busId);
          loadLastLocation(busId);

          // Listen to live socket updates
          socket.on(`bus-${busId}-location`, (live) => {
            const newLocation = {
              lat: live.latitude,
              lng: live.longitude,
            };

            // Update UI
            setBusLocation(newLocation);

            // Save offline
            localStorage.setItem(
              "lastBusLocation",
              JSON.stringify(newLocation)
            );
          });
        }
      } catch (err) {
        console.log("Dashboard error:", err);
      }
    };

    fetchDashboard();
  }, [studentUserId]);

  /* -----------------------------------------------------------
     2) LOAD BUS, DRIVER, ROUTE
  ----------------------------------------------------------- */
  const loadBusInfo = async (busId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/buses/info/${busId}`);
      const data = await res.json();

      if (data.success) {
        setBusInfo(data.bus);
        setDriverInfo(data.bus.assignedDriver);
        setRouteInfo(data.bus.assignedRoute);
      }
    } catch (err) {
      console.log("Bus info error:", err);
    }
  };

  /* -----------------------------------------------------------
     3) LOAD LAST SAVED LOCATION
  ----------------------------------------------------------- */
  const loadLastLocation = async (busId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/location/latest/${busId}`);
      const data = await res.json();

      if (data?.latitude && data?.longitude) {
        setBusLocation({ lat: data.latitude, lng: data.longitude });

        // Save offline
        localStorage.setItem(
          "lastBusLocation",
          JSON.stringify({ lat: data.latitude, lng: data.longitude })
        );
      }
    } catch (err) {
      console.log("Location error:", err);
    }
  };

  /* -----------------------------------------------------------
     4) TRACK BUS BUTTON
  ----------------------------------------------------------- */
  const handleTracking = () => {
    if (!busInfo?._id) return;
    setIsTracking((prev) => !prev);
    loadLastLocation(busInfo._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Student Dashboard
        </h1>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-indigo-100">
            <FaCog className="text-indigo-900 text-2xl" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bus Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaBus /> Bus Information
            </CardTitle>
          </CardHeader>

          <CardContent className="text-slate-600 space-y-2">
            <p>
              <strong>Bus Number:</strong>{" "}
              {busInfo?.busNumberPlate || "Loading..."}
            </p>
            <p>
              <strong>Driver Name:</strong> {driverInfo?.name || "Loading..."}
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              {driverInfo?.contactNumber || "Loading..."}
            </p>

            <Badge variant="outline" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </CardContent>
        </Card>

        {/* Route */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaRoad /> Route Details
            </CardTitle>
          </CardHeader>

          <CardContent className="text-slate-600 space-y-3">
            <p>
              <strong>Route:</strong> {routeInfo?.routeName || "Loading..."}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Stops:</strong>{" "}
              {routeInfo?.stops?.map((s) => s.name).join(" → ") || "Loading..."}
            </p>

            <Button
              onClick={handleTracking}
              className={`w-full ${
                isTracking
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}>
              {isTracking ? "Stop Tracking" : "Track My Bus"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* MAP */}
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <FaMapMarkerAlt /> Live Bus Location
          </CardTitle>
        </CardHeader>

        <CardContent>
          {busLocation ? (
            <MapContainer
              center={[busLocation.lat, busLocation.lng]}
              zoom={14}
              style={{ height: "350px", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <Marker position={[busLocation.lat, busLocation.lng]}>
                <Popup>🚌 Bus is here</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <p className="text-center text-slate-500">
              {isTracking
                ? "Waiting for driver location..."
                : "Click 'Track My Bus' to start tracking"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
