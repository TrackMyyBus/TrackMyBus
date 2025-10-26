import React, { useState } from "react";
import { routes as initialRoutes } from "@/lib/mock-data";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";

export default function RoutesSection() {
  const [expanded, setExpanded] = useState({});
  const [routes, setRoutes] = useState(initialRoutes);
  const [showForm, setShowForm] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: "", stops: "" });

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddRoute = (e) => {
    e.preventDefault();
    if (!newRoute.name.trim()) return;

    const newId = Object.keys(routes).length + 1;
    const stopsArray = newRoute.stops
      ? newRoute.stops.split(",").map((stop) => ({ label: stop.trim() }))
      : [];

    setRoutes({
      ...routes,
      [newId]: { id: newId, name: newRoute.name, stops: stopsArray },
    });
    setNewRoute({ name: "", stops: "" });
    setShowForm(false);
  };

  return (
    <div className="bg-gray-100 p-6 ml-16 rounded-2xl shadow-lg">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-900">
          Bus Routes Overview
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 text-sm sm:text-base transition">
          <FaPlus />
          <span className="hidden sm:inline">Add Route</span>
        </button>
      </div>

      {/* Add Route Form */}
      {showForm && (
        <form
          onSubmit={handleAddRoute}
          className="bg-white border border-yellow-400 p-4 rounded-xl shadow-md mb-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Add New Route</h3>

          <input
            type="text"
            placeholder="Route Name"
            value={newRoute.name}
            onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <textarea
            placeholder="Stops (comma-separated, e.g. Stop 1, Stop 2, Stop 3)"
            value={newRoute.stops}
            onChange={(e) =>
              setNewRoute({ ...newRoute, stops: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows={3}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white">
              Save Route
            </button>
          </div>
        </form>
      )}

      {/* Routes List */}
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
