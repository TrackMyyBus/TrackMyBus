import React, { useState } from "react";
import { FaSave } from "react-icons/fa";
import { motion } from "framer-motion";

export default function EditableTable({ data, type }) {
  const [rows, setRows] = useState(data);
  console.log(data);

  const handleChange = (id, key, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  // Capitalize the type for clean display
  const formattedType =
    type && type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto bg-white rounded-2xl shadow-lg p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          {formattedType ? `${formattedType} Data Table` : "Data Table"}
        </h1>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gradient-to-r from-yellow-200 to-yellow-100">
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {rows.map((row, idx) => (
            <tr
              key={row.id}
              className={`transition-all duration-200 hover:bg-yellow-50 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}>
              {Object.keys(row).map((key) => (
                <td className="px-6 py-3" key={key}>
                  <input
                    value={row[key]}
                    onChange={(e) => handleChange(row.id, key, e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                  />
                </td>
              ))}
              <td className="px-6 py-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 hover:shadow-lg transition">
                  <FaSave />
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
