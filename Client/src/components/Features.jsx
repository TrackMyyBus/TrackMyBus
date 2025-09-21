// src/components/Features.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Bell } from "lucide-react";

export default function Features() {
  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <main
      id="features"
      className="pt-8 relative bg-gradient-to-b from-gray-50 to-gray-100 -mt-12 z-20 rounded-t-2xl">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: intro */}
          <motion.div {...fadeUp} className="lg:col-span-5 space-y-6 py-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl text-indigo-900 font-extrabold leading-tight">
              Real-time Bus Tracking
            </motion.h2>

            <p className="text-slate-700 text-lg">
              TrackMyBus provides live GPS location sharing from driver phones,
              role-based dashboards for Admins, Drivers & Students, and instant
              notifications — built for security and reliability.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <FeatureCard
                icon={<MapPin size={28} />}
                title="Live Maps"
                text="Bus position & routes"
              />
              <FeatureCard
                icon={<Bell size={28} />}
                title="Alerts"
                text="Near-stop & delay notifications"
              />
              <FeatureCard
                icon={<Users size={28} />}
                title="Role Dashboards"
                text="Admin, Driver & Student views"
              />
            </div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 h-[500px] rounded-2xl overflow-hidden shadow-xl bg-white">
            <img
              src="https://i.pinimg.com/1200x/0b/8a/78/0b8a788dfe83416efe517e3ef089dea9.jpg"
              alt="App Preview"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow border border-slate-100 flex flex-col items-center text-center">
      <div className="w-12 h-12 mb-2 rounded-md bg-gradient-to-br from-indigo-600 to-blue-400 flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="font-medium text-sm">{title}</div>
      <div className="text-slate-500 text-xs">{text}</div>
    </div>
  );
}
