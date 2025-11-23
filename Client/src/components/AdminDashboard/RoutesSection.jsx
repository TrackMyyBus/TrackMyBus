import React, { useState, useEffect } from "react";
import axios from "axios";

// Simple Select Component
function Select({ label, field, options, setNewItem, display }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        className="w-full border p-2 rounded-lg"
        multiple
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map(
            (o) => o.value
          );
          setNewItem((prev) => ({ ...prev, [field]: selected }));
        }}>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {display(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function RoutesSection({ buses = [] }) {
  const [routes, setRoutes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  const [newRoute, setNewRoute] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    stops: "",
    totalDistance: "",
    estimatedDuration: "",
    assignedBuses: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const openAddForm = () => {
    setCurrentRoute(null);
    setNewRoute({
      routeName: "",
      startPoint: "",
      endPoint: "",
      stops: "",
      totalDistance: "",
      estimatedDuration: "",
      assignedBuses: [],
    });
    setShowForm(true);
  };

  const openEditForm = (route) => {
    setCurrentRoute(route);
    const safeStops = Array.isArray(route?.stops)
      ? route.stops.map((s) => s?.name || "").join(", ")
      : "";
    setNewRoute({
      routeName: route?.routeName || "",
      startPoint: route?.startPoint || "",
      endPoint: route?.endPoint || "",
      stops: safeStops,
      totalDistance: route?.totalDistance || "",
      estimatedDuration: route?.estimatedDuration || "",
      assignedBuses: route?.assignedBuses?.map((b) => b._id) || [],
    });
    setShowForm(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();

    const stopsArray = newRoute.stops
      .split(",")
      .map((s, i) => ({
        name: s.trim(),
        latitude: 0,
        longitude: 0,
        stopOrder: i + 1,
      }))
      .filter((s) => s.name);

    const payload = {
      routeName: newRoute.routeName,
      startPoint: newRoute.startPoint,
      endPoint: newRoute.endPoint,
      stops: stopsArray,
      totalDistance: Number(newRoute.totalDistance) || 0,
      estimatedDuration: newRoute.estimatedDuration,
      assignedBuses: newRoute.assignedBuses,
    };

    try {
      if (currentRoute) {
        await axios.put(
          `http://localhost:5000/api/routes/${currentRoute._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Route updated!");
      } else {
        await axios.post("http://localhost:5000/api/routes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Route added!");
      }

      setShowForm(false);
      fetchRoutes(); // refresh routes
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save route.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 ml-16 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-indigo-900">
          Bus Routes Overview
        </h2>
        <button
          onClick={openAddForm}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl shadow-md">
          Add Route
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-2xl font-bold text-center mb-4">
              {currentRoute ? "Edit Route" : "Add New Route"}
            </h3>
            <form onSubmit={handleSaveRoute} className="space-y-3">
              <input
                type="text"
                placeholder="Route Name"
                value={newRoute.routeName}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, routeName: e.target.value })
                }
                required
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Start Point"
                value={newRoute.startPoint}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, startPoint: e.target.value })
                }
                required
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="End Point"
                value={newRoute.endPoint}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, endPoint: e.target.value })
                }
                required
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Total Distance (km)"
                value={newRoute.totalDistance || ""}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, totalDistance: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Estimated Duration"
                value={newRoute.estimatedDuration || ""}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    estimatedDuration: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-lg"
              />
              <Select
                label="Assign Bus"
                field="assignedBuses"
                options={buses}
                setNewItem={setNewRoute}
                display={(b) => `${b.busNumberPlate} (${b.busId})`}
              />
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-2">
                Save Route
              </button>
            </form>
          </div>
        </div>
      )}

      <ul className="space-y-4">
        {routes.map((route) => (
          <li
            key={route._id}
            className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div
                className="cursor-pointer"
                onClick={() => toggleExpand(route._id)}>
                <h3 className="text-lg font-semibold">{route.routeName}</h3>
                <p className="text-sm text-gray-500">
                  {route?.stops?.length || 0} Stops
                </p>
              </div>
              <button
                onClick={() => openEditForm(route)}
                className="text-yellow-500 font-semibold">
                Edit
              </button>
            </div>
            {expanded[route._id] && (
              <ul className="mt-3 space-y-2">
                {route?.stops?.map((stop, i) => (
                  <li key={i} className="bg-yellow-50 p-2 rounded">
                    {stop?.name}
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
