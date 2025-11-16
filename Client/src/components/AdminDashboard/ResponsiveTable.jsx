import React, { useState, useEffect } from "react";
import { FaSave, FaSearch, FaPlus } from "react-icons/fa";
import axios from "axios";

export default function ResponsiveTable({ data, type }) {
  const [items, setItems] = useState(data);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [dropdowns, setDropdowns] = useState({
    drivers: [],
    routes: [],
    buses: [],
  });

  const normalizedType = type.toLowerCase().endsWith("es")
    ? type.toLowerCase().slice(0, -2)
    : type.toLowerCase().replace(/s$/, "");
  const formattedType =
    normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1);

  // ✅ Get token once
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "Students") {
          const res = await axios.get(
            "http://localhost:5000/api/admin/dashboard",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setItems(res.data.students || []);
        }
        if (type === "Buses" || type === "Students") {
          const dropRes = await axios.get(
            "http://localhost:5000/api/admin/dropdown-data",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setDropdowns(dropRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [type, token]);

  const handleChange = (id, key, value) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = (id) => {
    const savedItem = items.find((item) => item._id === id);
    console.log("Saved:", savedItem);
  };

  const filteredItems = items.filter((item) =>
    Object.values(item).some(
      (val) =>
        val && val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="w-[80%] h-full ml-16 flex flex-col p-2 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-2">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          {formattedType} Information
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 text-sm sm:text-base"
        >
          <FaPlus />
          <span className="hidden sm:inline">Add {formattedType}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 w-full max-w-md">
        <FaSearch className="text-gray-400 absolute ml-3 mt-2 pointer-events-none" />
        <input
          type="text"
          placeholder={`Search ${formattedType}s...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base transition"
        />
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[550px] max-h-[90vh] overflow-y-auto p-6 relative border border-gray-100">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-indigo-900 text-center mb-4">
              Add New {formattedType}
            </h2>
            <div className="h-1 w-16 bg-yellow-500 rounded mx-auto mb-6"></div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (normalizedType !== "student") return;

                const token = localStorage.getItem("token");

                try {
                  const res = await axios.post(
                    "http://localhost:5000/api/admin/create-student",
                    {
                      name: newItem.name,
                      enrollmentId: newItem.enrollmentId,
                      enrollmentYear: newItem.enrollmentYear,
                      email: newItem.email,
                      contactNumber: newItem.contactNumber,
                      address: newItem.address,
                      assignedBus: newItem.assignedBus, // Correct
                      assignedDriver: newItem.assignedDriver, // Correct
                      assignedRoute: newItem.assignedRoute, // Correct
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  alert("Student added successfully!");

                  setItems((prev) => [...prev, res.data.student]);
                  setShowForm(false);
                  setNewItem({});
                } catch (err) {
                  console.log(err);
                  alert(err.response?.data?.message || "Failed to add student");
                }
              }}
            >
              {/* STUDENT FORM */}
              {normalizedType === "student" && (
                <div className="space-y-3">
                  <Input label="Name" field="name" setNewItem={setNewItem} />
                  <Input
                    label="Enrollment ID"
                    field="enrollmentId"
                    setNewItem={setNewItem}
                  />
                  <Input
                    label="Enrollment Year"
                    type="number"
                    field="enrollmentYear"
                    setNewItem={setNewItem}
                  />
                  <Input label="Email" field="email" setNewItem={setNewItem} />
                  <Input
                    label="Contact Number"
                    field="contactNumber"
                    setNewItem={setNewItem}
                  />
                  <Input
                    label="Address"
                    field="address"
                    setNewItem={setNewItem}
                  />

                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Assigned Bus
                  </label>
                  <select
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        assignedBus: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Bus</option>
                    {dropdowns.buses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.busId} ({bus.busNumberPlate})
                      </option>
                    ))}
                  </select>

                  <label className="block text-sm font-medium text-gray-600 mb-1 mt-2">
                    Assigned Route
                  </label>
                  <select
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        assignedRoute: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select Route</option>
                    {dropdowns.routes.map((route) => (
                      <option key={route._id} value={route._id}>
                        {route.routeName} ({route.startPoint.name} →{" "}
                        {route.endPoint.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium shadow-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredItems.map((item) => (
          <div
            key={item._id ?? Math.random()}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col h-full"
          >
            {Object.entries(item).map(
              ([key, val]) =>
                key !== "_id" && (
                  <div className="mb-3" key={key}>
                    <label className="block text-gray-700 text-sm mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={
                        typeof val === "object"
                          ? JSON.stringify(val)
                          : val || ""
                      }
                      onChange={(e) =>
                        handleChange(item._id, key, e.target.value)
                      }
                      className="w-full border px-2 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
                    />
                  </div>
                )
            )}
            <button
              onClick={() => handleSave(item._id)}
              className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaSave />
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Reusable Input Component --- */
function Input({ label, field, type = "text", setNewItem }) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
        }
        required
      />
    </>
  );
}
