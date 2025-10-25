import React, { useState } from "react";
import { routes } from "@/lib/mock-data";
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function RoutesSection() {
  const [expanded, setExpanded] = useState({}); // track expanded routes

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-gray-100 p-6 ml-16 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">
        Bus Routes Overview
      </h2>
      <ul className="space-y-4">
        {Object.values(routes).map((route) => (
          <li
            key={route.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition cursor-pointer border-l-4 border-yellow-500">
            <div
              className="flex justify-between items-center"
              onClick={() => toggleExpand(route.id)}>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {route.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {route.stops.length} Stops
                </p>
              </div>
              <div className="text-yellow-500">
                {expanded[route.id] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {expanded[route.id] && (
              <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {route.stops.map((stop, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded shadow-sm">
                    <FaMapMarkerAlt className="text-yellow-500" />
                    <span className="text-gray-700">{stop.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
