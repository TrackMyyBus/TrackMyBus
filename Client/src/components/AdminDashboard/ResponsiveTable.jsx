import React, { useState } from "react";
import { FaSave, FaSearch, FaPlus } from "react-icons/fa";
import axios from "axios";

export default function ResponsiveTable({ data, type }) {
  const [items, setItems] = useState(data);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({});

  const handleChange = (id, key, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = (id) => {
    const savedItem = items.find((item) => item.id === id);
    console.log("Saved:", savedItem);
    // Add API call here to save to backend
  };

  // Filter items safely
  const filteredItems = items.filter((item) =>
    Object.values(item).some(
      (val) =>
        val !== undefined &&
        val !== null &&
        val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const formattedType =
    type && type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  return (
    <div className="w-[80%] h-full ml-16 flex flex-col p-2 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-2">
        <h1 className="text-3xl sm:text-3xl ml-1 font-extrabold text-indigo-900">
          {formattedType ? `${formattedType} Information` : "Information"}
        </h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md flex items-center gap-2 text-sm sm:text-base">
          <FaPlus />
          {/* Hide text on small screens */}
          <span className="hidden sm:inline">Add {formattedType}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 w-full max-w-md">
        <FaSearch className="text-gray-400 absolute ml-3 mt-2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base transition"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] sm:w-[400px] shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-indigo-900">
              Add New {formattedType}
            </h2>

            {/* Dynamically generate form fields */}
            {type === "student" && (
              <>
                <input
                  placeholder="Name"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, email: e.target.value })
                  }
                />
                <input
                  placeholder="Roll No"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, rollNo: e.target.value })
                  }
                />
              </>
            )}

            {type === "driver" && (
              <>
                <input
                  placeholder="Name"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, email: e.target.value })
                  }
                />
                <input
                  placeholder="License No"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, licenseNo: e.target.value })
                  }
                />
              </>
            )}

            {type === "bus" && (
              <>
                <input
                  placeholder="Bus ID"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, busId: e.target.value })
                  }
                />
                <input
                  placeholder="Driver Name"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, driverName: e.target.value })
                  }
                />
                <input
                  placeholder="Capacity"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, capacity: e.target.value })
                  }
                />
              </>
            )}

            {type === "route" && (
              <>
                <input
                  placeholder="Route Name"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
                <input
                  placeholder="Stops (comma separated)"
                  className="w-full mb-2 border p-2 rounded"
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      stops: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `http://localhost:5000/api/${type}s/add`,
                      newItem
                    );
                    setItems((prev) => [...prev, res.data]);
                    setShowForm(false);
                    setNewItem({});
                  } catch (err) {
                    console.error(err);
                    alert("Error adding new record");
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredItems.map((item) => (
          <div
            key={item.id ?? Math.random()} // fallback key if id is missing
            className="bg-white shadow-md rounded-xl p-4 flex flex-col h-full">
            {Object.keys(item).map(
              (key) =>
                key !== "id" && (
                  <div className="mb-3" key={`${item.id}-${key}`}>
                    <label className="block text-gray-700 text-sm mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={item[key]}
                      onChange={(e) =>
                        handleChange(item.id, key, e.target.value)
                      }
                      className="w-full border px-2 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm sm:text-base"
                    />
                  </div>
                )
            )}

            <button
              onClick={() => handleSave(item.id)}
              className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2 text-sm sm:text-base">
              <FaSave />
              Save
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-gray-500 col-span-full text-center mt-4">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
