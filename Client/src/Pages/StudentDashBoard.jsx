import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaClock,
  FaBus,
  FaRoad,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaCog,
  FaKey,
} from "react-icons/fa";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Connect socket
const socket = io("http://localhost:5000");

export default function StudentDashboard() {
  const [eta, setEta] = useState("5 mins");
  const [isTracking, setIsTracking] = useState(false);
  const [busLocation, setBusLocation] = useState(null);
  const [notifications, setNotifications] = useState([
    "Bus 101 left Vijay Nagar stop.",
    "Slight delay due to traffic near Palasia.",
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  const studentId = "ST201"; // replace with real student ID from token later

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab");
    navigate("/");
  };

  // SOCKET LISTENERS
  useEffect(() => {
    // Join student room (for receiving driver updates)
    socket.emit("join-student", studentId);

    // Receive live bus location from backend (ROOM based)
    socket.on("location-update", (data) => {
      console.log("📍 Bus Update Received:", data);

      setBusLocation({
        lat: data.latitude,
        lng: data.longitude,
      });
    });

    return () => {
      socket.off("location-update");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Student Dashboard
        </h1>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-indigo-100 transition">
            <FaCog className="text-indigo-900 text-2xl" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus Info */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaBus /> Bus Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 space-y-2">
            <p>
              <strong>Bus Number:</strong> MP09-B-2211
            </p>
            <p>
              <strong>Driver Name:</strong> Ramesh Kumar
            </p>
            <p>
              <strong>Contact:</strong> +91 9876543210
            </p>
            <div>
              <p>
                <strong>Status:</strong>
              </p>
              <Badge variant="outline" className="bg-green-100 text-green-700">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Route & ETA */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaRoad /> Route Details
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600 space-y-3">
            <p>
              <strong>Route:</strong> Vijay Nagar → Palasia → College
            </p>
            <p className="flex items-center gap-2">
              <FaClock className="text-yellow-500" />
              <span>
                <strong>ETA:</strong> {eta}
              </span>
            </p>
            <Button
              onClick={() => {
                setIsTracking(!isTracking);
                socket.emit("request-bus-location", { studentId });
              }}
              className={`w-full ${
                isTracking
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}>
              {isTracking ? "Stop Tracking" : "Track My Bus"}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FaBell /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-600">
            {notifications.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-yellow-50 p-3 rounded-lg shadow-sm">
                {n}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mt-8 shadow-lg border-none col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <FaMapMarkerAlt /> Live Bus Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {busLocation ? (
            <MapContainer
              center={[busLocation.lat || 22.7196, busLocation.lng || 75.8577]}
              zoom={14}
              style={{ height: "350px", width: "100%", borderRadius: "12px" }}>
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

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 bg-indigo-50 p-4 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 text-indigo-900 font-medium">
          <FaClock />
          {isTracking
            ? "Tracking live bus location..."
            : "Click 'Track My Bus' to start"}
        </div>
        <span className="text-slate-600 text-sm">Student ID: {studentId}</span>
      </motion.div>
    </div>
  );
}
