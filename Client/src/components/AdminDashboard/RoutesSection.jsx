import React, { useState, useEffect } from "react";
import axios from "axios";

/* =====================================================
   REUSABLE SAFE SINGLE SELECT
===================================================== */
function SingleSelect({ label, field, options, value, setNewItem, display }) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>

      <select
        className="w-full border p-2 rounded-lg"
        value={value || ""}
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
        }>
        <option value="">Select</option>

        {safeOptions.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {display(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =====================================================
   MAIN ROUTES SECTION
===================================================== */
export default function RoutesSection({
  buses = [],
  drivers = [],
  refreshRoutes,
}) {
  const [routes, setRoutes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminId =
    localStorage.getItem("adminId") || user.adminId || user._id || "";
  const token = localStorage.getItem("token");

  const [newRoute, setNewRoute] = useState({
    routeName: "",
    startPoint: "",
    endPoint: "",
    stops: "",
    totalDistance: "",
    estimatedDuration: "",
    assignedBuses: [],
    assignedDriver: "", // ⭐ REQUIRED FIELD
  });

  /* =====================================================
       FETCH ROUTES
  ===================================================== */
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/routes/all/${adminId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoutes(res.data.routes || []);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  /* =====================================================
       OPEN ADD FORM
  ===================================================== */
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
      assignedDriver: "",
    });
    setShowForm(true);
  };

  /* =====================================================
       OPEN EDIT FORM
  ===================================================== */
  const openEditForm = (route) => {
    setCurrentRoute(route);

    const safeStops = Array.isArray(route?.stops)
      ? route.stops.map((s) => s?.name || "").join(", ")
      : "";

    setNewRoute({
      routeName: route.routeName,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      stops: safeStops,
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
      assignedBuses: route?.assignedBuses?.map((b) => b._id) || [],
      assignedDriver: route?.assignedDriver?._id || "",
    });

    setShowForm(true);
  };

  /* =====================================================
       SAVE ROUTE (ADD/UPDATE)
  ===================================================== */
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
      institute: adminId,
    };

    // ⭐ Only send driver if selected
    if (newRoute.assignedDriver) {
      payload.assignedDriver = newRoute.assignedDriver;
    }

    try {
      if (currentRoute) {
        await axios.put(
          `http://localhost:5000/api/routes/update/${currentRoute._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Route updated!");
      } else {
        await axios.post("http://localhost:5000/api/routes/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Route added!");
      }

      setShowForm(false);
      fetchRoutes();
      if (refreshRoutes) refreshRoutes();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save route.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 ml-16 rounded-2xl shadow-lg">
      {/* HEADER */}
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

      {/* FORM MODAL */}
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
                placeholder="Total Distance"
                value={newRoute.totalDistance}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, totalDistance: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Estimated Duration"
                value={newRoute.estimatedDuration}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    estimatedDuration: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-lg"
              />

              <input
                type="text"
                placeholder="Stops (comma separated)"
                value={newRoute.stops}
                onChange={(e) =>
                  setNewRoute({ ...newRoute, stops: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />

              {/* SELECT BUS */}
              <SingleSelect
                label="Assign Bus"
                field="assignedBuses"
                options={buses}
                value={newRoute.assignedBuses}
                setNewItem={setNewRoute}
                display={(b) => `${b.busNumberPlate} (${b.busId})`}
              />

              {/* SELECT DRIVER */}
              <SingleSelect
                label="Assign Driver"
                field="assignedDriver"
                options={drivers}
                value={newRoute.assignedDriver}
                setNewItem={setNewRoute}
                display={(d) => `${d.driverId} - ${d.name}`}
              />

              <button className="w-full bg-yellow-500 text-white py-2 rounded-lg mt-2">
                Save Route
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ROUTE LIST */}
      <ul className="space-y-4">
        {routes.map((route) => (
          <li key={route._id} className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-center">
              <div
                onClick={() =>
                  setExpanded({
                    ...expanded,
                    [route._id]: !expanded[route._id],
                  })
                }
                className="cursor-pointer">
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
                {(route.stops || []).map((stop, i) => (
                  <li key={i} className="bg-yellow-50 p-2 rounded">
                    {stop.name}
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
