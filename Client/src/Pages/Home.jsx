// src/pages/Home.jsx
import React from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Contact />
      <footer className="py-6 text-center bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} TrackMyBus — Built with ❤️ for safe
          journeys.
        </p>
      </footer>
    </div>
  );
}
