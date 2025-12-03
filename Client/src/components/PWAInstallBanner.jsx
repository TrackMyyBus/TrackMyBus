// src/components/PWAInstallBanner.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { triggerPWAInstall } from "../main";

export default function PWAInstallBanner() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const installReady = localStorage.getItem("pwa-install-ready") === "true";

      setReady(installReady);

      // Show only if user has not closed in this session
      if (installReady && !sessionStorage.getItem("pwa-banner-closed")) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (!ready || !visible) return null;

  const handleClose = () => {
    sessionStorage.setItem("pwa-banner-closed", "true"); // session only
    setVisible(false);
  };

  const handleInstall = () => {
    triggerPWAInstall();
    sessionStorage.setItem("pwa-banner-closed", "true");
    setVisible(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-yellow-500 text-white text-center py-3 fixed top-0 left-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        <span className="font-semibold">📲 Install TrackMyBus App?</span>

        <button
          onClick={handleInstall}
          className="bg-white text-yellow-600 font-bold px-3 py-1 rounded shadow">
          Install
        </button>

        <button onClick={handleClose} className="ml-4 text-white font-bold">
          ✖
        </button>
      </div>
    </motion.div>
  );
}
