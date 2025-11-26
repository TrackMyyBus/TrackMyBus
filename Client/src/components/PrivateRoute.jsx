// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  // Example: check if user is logged in and their role
  const token = localStorage.getItem("token"); // your auth token
  const userRole = localStorage.getItem("role"); // e.g., "admin", "driver", "student"

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Logged in but role doesn't match → redirect to home or error page
    return <Navigate to="/" replace />;
  }

  // Logged in & role matches → render the children
  return children;
}
