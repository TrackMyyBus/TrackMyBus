// AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // -------------------------------------------------
  // SAFE Load user on refresh (prevents crash)
  // -------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        console.log("User loaded:", parsed);
      } else {
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("AuthContext JSON parse error:", err);
      localStorage.removeItem("user");
    }
  }, []);

  // -------------------------------------------------
  // LOGIN
  // -------------------------------------------------
  const loginUser = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    // ⭐ ADMIN
    if (userData.role === "admin" && userData.adminId) {
      localStorage.setItem("adminId", userData.adminId);
    }

    // ⭐ STUDENT
    if (userData.role === "student") {
      localStorage.setItem("studentUserId", userData.userId); // Login User ID
      localStorage.setItem("studentProfileId", userData.profile._id); // Profile ID
      localStorage.setItem("enrollmentId", userData.profile.enrollmentId);
    }

    // ⭐ DRIVER
    if (userData.role === "driver") {
      localStorage.setItem("driverUserId", userData.userId); // Login User ID
      localStorage.setItem("driverProfileId", userData.profile._id); // Profile ID
    }

    setUser(userData);
  };

  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------
  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");

    // Student
    localStorage.removeItem("studentUserId");
    localStorage.removeItem("studentProfileId");
    localStorage.removeItem("enrollmentId");

    // Driver
    localStorage.removeItem("driverUserId");
    localStorage.removeItem("driverProfileId");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
