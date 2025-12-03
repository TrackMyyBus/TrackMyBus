import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <AuthRedirect message="Please login first!" redirect="/login" />;
  }

  // Logged in but wrong role
  if (role && userRole?.toLowerCase().trim() !== role.toLowerCase().trim()) {
    return (
      <AuthRedirect
        message={`Access denied! Only ${role.toUpperCase()} can access this page.`}
        redirect="/"
      />
    );
  }

  // All good
  return children;
}

/* -----------------------------------------------
   Custom Component to Show Popup → Then Redirect
------------------------------------------------- */
function AuthRedirect({ message, redirect }) {
  useEffect(() => {
    alert(message);
  }, [message]);

  return <Navigate to={redirect} replace />;
}
