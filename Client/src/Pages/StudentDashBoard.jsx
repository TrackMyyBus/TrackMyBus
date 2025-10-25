import React, { useState } from "react";
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
} from "react-icons/fa";

export default function StudentDashboard() {
  const [eta, setEta] = useState("5 mins");
  const [isTracking, setIsTracking] = useState(false);
  const [notifications, setNotifications] = useState([
    "Bus 101 left Vijay Nagar stop.",
    "Slight delay due to traffic near Palasia.",
  ]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeTab");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Student Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 font-medium transition-colors">
          <FaSignOutAlt /> Logout
        </button>
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
              onClick={() => setIsTracking(!isTracking)}
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

      {/* Map placeholder */}
      <Card className="mt-8 shadow-lg border-none col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <FaMapMarkerAlt /> Bus Location Map
          </CardTitle>
        </CardHeader>
        <CardContent className="text-slate-600 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          <span className="text-gray-500">Map will be displayed here</span>
        </CardContent>
      </Card>

      {/* Footer bar */}
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
        <span className="text-slate-600 text-sm">Student ID: ST201</span>
      </motion.div>
    </div>
  );
}
