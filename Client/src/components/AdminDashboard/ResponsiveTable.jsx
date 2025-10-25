import React, { useState } from "react";
import { FaSave, FaSearch } from "react-icons/fa";

export default function ResponsiveTable({ data, type }) {
  const [items, setItems] = useState(data);
  const [search, setSearch] = useState("");

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
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-4 sm:mb-2">
        {formattedType ? `${formattedType} Information` : "Information"}
      </h1>

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
