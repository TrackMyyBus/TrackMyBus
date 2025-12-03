import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// -----------------------------
// Select Component (FIXED)
// -----------------------------
function SingleSelect({
  label,
  field,
  options = [],
  value,
  setNewItem,
  display,
}) {
  const safeValue = Array.isArray(value) ? "" : value || ""; // Fix for scalar value
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>

      <select
        className="w-full border p-2 rounded-lg"
        value={safeValue}
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
        }>
        <option value="">Select</option>
        {Array.isArray(options) &&
          options.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {display(opt)}
            </option>
          ))}
      </select>
    </div>
  );
}

export default function RoutesSection({
  buses = [],
  drivers = [],
  refreshRoutes,
}) {
  const [routes, setRoutes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [loadingStops, setLoadingStops] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminId = localStorage.getItem("adminId") || user.adminId || user._id;
  const token = localStorage.getItem("token");

  const [newRoute, setNewRoute] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    stops: "",
    totalDistance: "",
    estimatedDuration: "",
    assignedBus: "",
    assignedDriver: "",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/routes/all/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(res.data.routes || []);
    } catch (err) {
      console.error("Routes load error:", err);
    }
  };

  const openAddForm = () => {
    setCurrentRoute(null);
    setNewRoute({
      routeName: "",
      startPoint: "",
      endPoint: "",
      stops: "",
      totalDistance: "",
      estimatedDuration: "",
      assignedBus: "",
      assignedDriver: "",
    });
    setShowForm(true);
  };

  const openEditForm = (route) => {
    setCurrentRoute(route);
    setNewRoute({
      routeName: route.routeName,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      stops: (route.stops || []).map((s) => s.name).join(", "),
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
      assignedBus: route.assignedBus?._id || "",
      assignedDriver: route.assignedDriver?._id || "",
    });
    setShowForm(true);
  };

  // -----------------------------
  // ⭐ BACKEND PROXY GEOCODING
  // -----------------------------
  const geocodeLocation = async (place) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/geocode?place=${encodeURIComponent(place)}`
      );
      return { lat: res.data.lat, lon: res.data.lon };
    } catch (err) {
      return { lat: 0, lon: 0 };
    }
  };

  // -----------------------------
  // ⭐ SAVE ROUTE WITH REAL COORDINATES
  // -----------------------------
  const handleSaveRoute = async (e) => {
    e.preventDefault();
    setLoadingStops(true);

    const stopNames = newRoute.stops
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const stopsArray = [];
    for (let i = 0; i < stopNames.length; i++) {
      const name = stopNames[i];
      const geo = await geocodeLocation(name);

      stopsArray.push({
        name,
        latitude: geo.lat,
        longitude: geo.lon,
        stopOrder: i + 1,
      });
    }

    const payload = {
      routeName: newRoute.routeName,
      startPoint: newRoute.startPoint,
      endPoint: newRoute.endPoint,
      stops: stopsArray,
      totalDistance: Number(newRoute.totalDistance) || 0,
      estimatedDuration: newRoute.estimatedDuration,
      assignedBuses: newRoute.assignedBus ? [newRoute.assignedBus] : [],
      assignedDriver: newRoute.assignedDriver || null,
      institute: adminId,
    };

    try {
      if (currentRoute) {
        await axios.put(
          `${API_BASE_URL}/api/routes/update/${currentRoute._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Route updated!");
      } else {
        await axios.post("${API_BASE_URL}/api/routes/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Route added!");
      }

      setShowForm(false);
      fetchRoutes();
      refreshRoutes?.();
    } catch (err) {
      console.error("Save route error:", err);
      alert("Failed to save route.");
    }

    setLoadingStops(false);
  };

  return (
    <div className="w-full bg-gray-50 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-indigo-900">
          Bus Routes Overview
        </h2>
        <button
          onClick={openAddForm}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl">
          Add Route
        </button>
      </div>

      {/* --------------------------- FORM MODAL --------------------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setShowForm(false)}>
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-4">
              {currentRoute ? "Edit Route" : "Add Route"}
            </h3>

            <form onSubmit={handleSaveRoute} className="space-y-3">
              <input
                type="text"
                placeholder="Route Name"
                className="w-full border p-2 rounded-lg"
                value={newRoute.routeName}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, routeName: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Start Point"
                className="w-full border p-2 rounded-lg"
                value={newRoute.startPoint}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, startPoint: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="End Point"
                className="w-full border p-2 rounded-lg"
                value={newRoute.endPoint}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, endPoint: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Stops (comma separated)"
                className="w-full border p-2 rounded-lg"
                value={newRoute.stops}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, stops: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Total Distance"
                className="w-full border p-2 rounded-lg"
                value={newRoute.totalDistance}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, totalDistance: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Estimated Duration"
                className="w-full border p-2 rounded-lg"
                value={newRoute.estimatedDuration}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    estimatedDuration: e.target.value,
                  })
                }
              />

              <SingleSelect
                label="Assign Bus"
                field="assignedBus"
                options={buses}
                value={newRoute.assignedBus}
                setNewItem={setNewRoute}
                display={(b) => `${b.busNumberPlate} (${b.busId})`}
              />

              <SingleSelect
                label="Assign Driver"
                field="assignedDriver"
                options={drivers}
                value={newRoute.assignedDriver}
                setNewItem={setNewRoute}
                display={(d) => `${d.driverId} - ${d.name}`}
              />

              <button className="w-full bg-yellow-500 text-white py-2 rounded-lg">
                {loadingStops ? "Geocoding..." : "Save Route"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------- ROUTE LIST --------------------------- */}
      <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route._id} className="bg-white p-4 rounded-xl shadow-md">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() =>
                setExpanded((prev) => ({
                  ...prev,
                  [route._id]: !prev[route._id],
                }))
              }>
              <div>
                <h3 className="text-lg font-bold">{route.routeName}</h3>
                <p className="text-gray-500 text-sm">
                  {route.stops?.length || 0} Stops
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditForm(route);
                }}
                className="text-yellow-500 font-semibold">
                Edit
              </button>
            </div>

            {expanded[route._id] && (
              <ul className="mt-3 space-y-2">
                {route.stops?.map((stop) => (
                  <li
                    key={stop._id}
                    className="bg-yellow-50 p-2 rounded text-sm">
                    <strong>{stop.name}</strong>
                    <br />
                    <span className="text-gray-500 text-xs">
                      {stop.latitude}, {stop.longitude}
                    </span>
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
