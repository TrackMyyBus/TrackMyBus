// src/components/Hero.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <section
      id="hero"
      className="relative h-[90vh] flex items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://stnonline.com/wp-content/uploads/2020/04/edulog-apr20-phone-in-hand.jpg')",
      }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <motion.div {...fadeUp} className="text-white">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/favicon.png"
              alt="logo"
              className="w-10 h-10 rounded-xl bg-white"
            />
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">TrackMyBus</h1>
              <p className="text-xs text-slate-200">
                Safe. Real-time. Reliable.
              </p>
            </div>
          </div>
          <p className="text-lg mb-8">
            Know where your bus is — every step of the way! Stay informed with
            live GPS tracking and instant alerts.
          </p>
          <RouterLink to="/login">
            <Button className="bg-gray-100 text-black hover:bg-yellow-400 hover:font-bold px-6 py-3 rounded-lg font-semibold">
              Get Started
            </Button>
          </RouterLink>
        </motion.div>
      </div>
    </section>
  );
}
