// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ⭐ MULTIPLE ROLE SUPPORT
  // role can be: "admin" OR "admin,driver,student"
  if (role) {
    const allowedRoles = role.split(",").map((r) => r.trim());

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
