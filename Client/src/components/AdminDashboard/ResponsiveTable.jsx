import React, { useState, useEffect } from "react";
import { FaSave, FaSearch, FaPlus } from "react-icons/fa";
import axios from "axios";

export default function ResponsiveTable({
  type,
  data,
  buses,
  drivers,
  routes,
  refreshData,
}) {
  const [items, setItems] = useState(data || []);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({});

  const normalizedType = type.toLowerCase();
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

  // Sync local items with parent prop
  useEffect(() => {
    setItems(data || []);
  }, [data]);

  const dropdowns = { buses, drivers, routes };

  const handleChange = (id, key, value) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [key]: value } : item))
    );
  };

  const handleSave = async (id) => {
    try {
      const savedItem = items.find((i) => i._id === id);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/${normalizedType}/${id}`,
        savedItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`${formattedType} saved successfully!`);
      refreshData(); // Refresh parent data
    } catch (err) {
      console.error(err);
      alert("Failed to save. Check console.");
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/${normalizedType}`, newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewItem({});
      setShowForm(false);
      alert(`${formattedType} added successfully!`);
      refreshData(); // Refresh parent data
    } catch (err) {
      console.error(err);
      alert("Failed to add item. Check console.");
    }
  };

  const filteredItems = items.filter((item) =>
    Object.values(item).some(
      (val) =>
        val && val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const renderFormFields = () => {
    switch (normalizedType) {
      case "student":
        return (
          <>
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
            <Input
              label="Email"
              type="email"
              field="email"
              setNewItem={setNewItem}
            />
            <Input
              label="Contact Number"
              field="contactNumber"
              setNewItem={setNewItem}
            />
            <Input label="Address" field="address" setNewItem={setNewItem} />
            <Select
              label="Assigned Bus"
              field="assignedBus"
              options={dropdowns.buses}
              setNewItem={setNewItem}
              display={(b) => `${b.busId} (${b.busNumberPlate})`}
            />
            <Select
              label="Assigned Driver"
              field="assignedDriver"
              options={dropdowns.drivers}
              setNewItem={setNewItem}
              display={(d) => `${d.name} (${d.driverId})`}
            />
            <Select
              label="Assigned Route"
              field="assignedRoute"
              options={dropdowns.routes}
              setNewItem={setNewItem}
              display={(r) =>
                `${r.routeName} (${r.startPoint.name} → ${r.endPoint.name})`
              }
            />
          </>
        );
      case "driver":
        return (
          <>
            <Input label="Name" field="name" setNewItem={setNewItem} />
            <Input label="Driver ID" field="driverId" setNewItem={setNewItem} />
            <Input
              label="Email"
              type="email"
              field="email"
              setNewItem={setNewItem}
            />
            <Input
              label="Contact Number"
              field="contactNumber"
              setNewItem={setNewItem}
            />
            <Input label="Address" field="address" setNewItem={setNewItem} />
            <Select
              label="Assigned Bus"
              field="assignedBus"
              options={dropdowns.buses}
              setNewItem={setNewItem}
              display={(b) => `${b.busId} (${b.busNumberPlate})`}
            />
            <Select
              label="Assigned Route"
              field="assignedRoute"
              options={dropdowns.routes}
              setNewItem={setNewItem}
              display={(r) =>
                `${r.routeName} (${r.startPoint.name} → ${r.endPoint.name})`
              }
            />
            <Select
              label="Status"
              field="isActive"
              options={[
                { _id: "1", value: true },
                { _id: "2", value: false },
              ]}
              setNewItem={setNewItem}
              display={(v) => (v.value ? "Active" : "Inactive")}
            />
          </>
        );
      case "bus":
        return (
          <>
            <Input label="Bus ID" field="busId" setNewItem={setNewItem} />
            <Input
              label="Bus Number Plate"
              field="busNumberPlate"
              setNewItem={setNewItem}
            />
            <Select
              label="Assigned Driver"
              field="assignedDriver"
              options={dropdowns.drivers}
              setNewItem={setNewItem}
              display={(d) => `${d.name} (${d.driverId})`}
            />
            <Select
              label="Assigned Route"
              field="assignedRoute"
              options={dropdowns.routes}
              setNewItem={setNewItem}
              display={(r) =>
                `${r.routeName} (${r.startPoint.name} → ${r.endPoint.name})`
              }
            />
            <Select
              label="Status"
              field="status"
              options={[
                { _id: "1", value: "active" },
                { _id: "2", value: "inactive" },
                { _id: "3", value: "maintenance" },
              ]}
              setNewItem={setNewItem}
              display={(v) => v.value}
            />
          </>
        );
      default:
        return <Input label="Name" field="name" setNewItem={setNewItem} />;
    }
  };

  return (
    <div className="w-[80%] h-full ml-16 flex flex-col p-2 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-2">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          {formattedType} Information
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
          <FaPlus />{" "}
          <span className="hidden sm:inline">Add {formattedType}</span>
        </button>
      </div>

      <div className="relative mb-4 w-full max-w-md">
        <FaSearch className="text-gray-400 absolute ml-3 mt-2 pointer-events-none" />
        <input
          type="text"
          placeholder={`Search ${formattedType}s...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] sm:w-[550px] shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-gray-500 text-2xl">
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Add New {formattedType}
            </h2>
            <form onSubmit={handleAddNew} className="space-y-3">
              {renderFormFields()}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col h-full">
            {Object.entries(item).map(([key, val]) =>
              key !== "_id" ? (
                <div className="mb-3" key={key}>
                  <label className="block text-gray-700 text-sm mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={
                      typeof val === "object" ? JSON.stringify(val) : val || ""
                    }
                    onChange={(e) =>
                      handleChange(item._id, key, e.target.value)
                    }
                    className="w-full border px-2 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              ) : null
            )}
            <button
              onClick={() => handleSave(item._id)}
              className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md flex items-center justify-center gap-2">
              <FaSave /> Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          setNewItem((prev) => ({ ...prev, [field]: e.target.value || "" }))
        }
      />
    </>
  );
}

function Select({ label, field, options, setNewItem, display }) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-600 mb-1 mt-2">
        {label}
      </label>
      <select
        className="w-full border p-2 rounded-lg"
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value || null }))
        }>
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt._id ?? opt.value} value={opt._id ?? opt.value}>
            {display(opt)}
          </option>
        ))}
      </select>
    </>
  );
}
