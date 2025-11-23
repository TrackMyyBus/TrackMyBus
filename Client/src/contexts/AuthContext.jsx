import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Current logged-in user:", JSON.parse(storedUser));
    }
  }, []);

  // FIXED LOGIN FUNCTION
  const loginUser = (userData, token) => {
    // Store user info
    localStorage.setItem("user", JSON.stringify(userData));

    // Store adminId separately (optional)
    if (userData.adminId) {
      localStorage.setItem("adminId", userData.adminId);
    }

    // Store token
    localStorage.setItem("token", token);

    setUser(userData);
    console.log("User logged in:", userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    setUser(null);

    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
