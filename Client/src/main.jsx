// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

import { registerSW } from "virtual:pwa-register";

// GLOBAL install prompt capture
let deferredPrompt = null;

// Listen for browser install event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();

  deferredPrompt = e;

  // Mark install as available
  localStorage.setItem("pwa-install-ready", "true");
});

// Function to trigger installation
export function triggerPWAInstall() {
  if (!deferredPrompt) {
    console.log("Install prompt not ready");
    return;
  }

  deferredPrompt.prompt();

  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;

    // Installation successful → stop showing banners
    localStorage.removeItem("pwa-install-ready");
    sessionStorage.removeItem("pwa-banner-closed");
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.installEvent = e;
  console.log("👉 INSTALL PROMPT STORED");
});

// Register service worker
registerSW({
  immediate: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
