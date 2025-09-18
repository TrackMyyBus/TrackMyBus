// src/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MapPin, Clock } from "lucide-react";

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E0F2FF] to-[#FFFFFF] flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-20 gap-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#0077B6] drop-shadow-lg text-center md:text-left">
          TrackMyBus
        </h1>
        <Button className="bg-[#00B4D8] text-white hover:bg-[#0077B6] transition-all duration-300 shadow-lg rounded-full px-8 py-3">
          Login
        </Button>
      </header>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl">
        {[
          {
            icon: <MapPin size={28} />,
            title: "Track Bus",
            desc: "View the live location of your school bus on the map.",
            btn: "Track Now",
          },
          {
            icon: <Clock size={28} />,
            title: "View ETA",
            desc: "Check estimated arrival time for your bus.",
            btn: "Check ETA",
          },
          {
            icon: <Bell size={28} />,
            title: "Alerts",
            desc: "Receive notifications about delays or bus arrivals.",
            btn: "View Alerts",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center bg-white shadow-2xl rounded-3xl p-8 hover:scale-105 transition-transform duration-300 border-t-4 border-[#00B4D8] cursor-pointer"
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}>
            <CardHeader className="w-full flex justify-center">
              <CardTitle className="flex items-center gap-3 text-[#0077B6] text-2xl font-semibold">
                {card.icon} {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-[#023E8A] font-medium text-base md:text-lg">
                {card.desc}
              </p>
              <Button className="bg-[#00B4D8] text-white hover:bg-[#0077B6] w-full transition-all duration-300 shadow-md rounded-full py-3">
                {card.btn}
              </Button>
            </CardContent>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-24 w-full max-w-7xl text-center text-[#0077B6] font-semibold text-sm md:text-base">
        © 2025 TrackMyBus. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
