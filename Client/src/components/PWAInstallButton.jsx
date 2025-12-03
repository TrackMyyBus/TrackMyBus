// src/components/PWAInstallButton.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { triggerPWAInstall } from "../main";

export default function PWAInstallButton() {
  const [ready, setReady] = useState(
    localStorage.getItem("pwa-install-ready") === "true"
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const flag = localStorage.getItem("pwa-install-ready") === "true";
      const dismissed = localStorage.getItem("pwa-banner-dismissed") === "true";

      // Floating button should NOT show if user dismissed banner
      setReady(flag);
      setVisible(flag && !dismissed);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (!ready || !visible) return null;

  const install = () => {
    triggerPWAInstall();
    localStorage.setItem("pwa-banner-dismissed", "true");
    setVisible(false);
  };

  return (
    <motion.button
      onClick={install}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 
                 text-white font-semibold px-4 py-3 rounded-full shadow-lg z-50">
      📲 Install App
    </motion.button>
  );
}
