// src/components/Contact.jsx
"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="bg-gray-50 py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid gap-12 md:grid-cols-2 items-center">
        {/* Left: Contact info cards */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
            Get in Touch
          </h2>
          <p className="text-slate-600 text-lg">
            Whether you’re a parent, student, driver, or administrator — we’d
            love to hear from you. Reach out for support, feedback, or
            collaborations.
          </p>

          <div className="grid gap-4">
            <ContactCard
              icon={<Mail className="w-6 h-6 text-indigo-600" />}
              title="Email"
              text="support@trackmybus.com"
            />
            <ContactCard
              icon={<Phone className="w-6 h-6 text-indigo-600" />}
              title="Phone"
              text="+91 99******60"
            />
            <ContactCard
              icon={<MapPin className="w-6 h-6 text-indigo-600" />}
              title="From"
              text="Indore, Madhya Pradesh, India"
            />
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-indigo-800 mb-6">
            Send us a Message
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              className="w-full p-3 rounded-lg border border-gray-300 h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow border border-slate-100">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-indigo-900">{title}</h4>
        <p className="text-slate-600 text-sm">{text}</p>
      </div>
    </div>
  );
}
