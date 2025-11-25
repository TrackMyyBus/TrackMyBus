// ResponsiveTable.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTrash, FaSave } from "react-icons/fa";
import axios from "axios";

export default function ResponsiveTable({
  type,
  data,
  buses = [],
  drivers = [],
  routes = [],
  refreshData,
}) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({});

  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("adminId");

  const normalizedType = type.toLowerCase();
  const formattedType = type[0].toUpperCase() + type.slice(1);

  useEffect(() => {
    if (Array.isArray(data)) setItems(data);
  }, [data]);

  const API_PREFIX_MAP = {
    student: "/api/students",
    driver: "/api/drivers",
    bus: "/api/bus",
  };
  const apiPrefix = API_PREFIX_MAP[normalizedType];

  /* ============================================================
      ADD NEW
  ============================================================ */
  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!adminId) return alert("Admin ID missing!");

    let payload = { ...newItem, institute: adminId };

    if (normalizedType === "driver") {
      payload.password = newItem.password || newItem.driverId;
    }

    try {
      await axios.post(`http://localhost:5000${apiPrefix}/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowForm(false);
      setNewItem({});
      refreshData();
      alert(`${formattedType} created!`);
    } catch (err) {
      console.log(err);
      alert("Creation failed");
    }
  };

  /* ============================================================
      UPDATE — FIXED WITH ASSIGN LOGIC
  ============================================================ */
  const handleUpdate = async () => {
    try {
      /* 🎯 STUDENT ASSIGNMENT */
      if (normalizedType === "student") {
        await axios.put(
          `http://localhost:5000/api/students/assign/${selectedItem._id}`,
          {
            assignedBus: selectedItem.assignedBus,
            assignedRoute: selectedItem.assignedRoute,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Student updated (Bus & Route Assigned)");
        setShowDrawer(false);
        refreshData();
        return;
      }

      /* 🎯 DRIVER ASSIGNMENT */
      if (normalizedType === "driver") {
        await axios.put(
          `http://localhost:5000/api/drivers/assign/${selectedItem._id}`,
          {
            assignedBus: selectedItem.assignedBus,
            assignedRoute: selectedItem.assignedRoute,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Driver updated (Bus & Route Assigned)");
        setShowDrawer(false);
        refreshData();
        return;
      }

      /* 🎯 BUS ASSIGNMENT */
      if (normalizedType === "bus") {
        const busId = selectedItem._id;

        // Assign DRIVER to bus
        if (selectedItem.assignedDriver) {
          await axios.put(
            `http://localhost:5000/api/bus/assign-driver/${busId}`,
            { driverId: selectedItem.assignedDriver },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Assign ROUTE to bus
        if (selectedItem.assignedRoute) {
          await axios.put(
            `http://localhost:5000/api/bus/assign-route/${busId}`,
            { routeId: selectedItem.assignedRoute },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        alert("Bus updated (Driver/Route assigned)");
        setShowDrawer(false);
        refreshData();
        return;
      }

      /* DEFAULT UPDATE */
      await axios.put(
        `http://localhost:5000${apiPrefix}/update/${selectedItem._id}`,
        selectedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`${formattedType} updated!`);
      setShowDrawer(false);
      refreshData();
    } catch (err) {
      console.log(err);
      alert("Update failed.");
    }
  };

  /* ============================================================
      DELETE
  ============================================================ */
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000${apiPrefix}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshData();
      alert("Deleted!");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const filteredItems = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  /* ============================================================
      DRAWER SUPPORT COMPONENTS
  ============================================================ */
  const DrawerField = ({ label, field, disabled = false, type = "text" }) => (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        disabled={disabled}
        className={`w-full border p-2 rounded-lg mt-1 ${
          disabled ? "bg-gray-200 cursor-not-allowed" : ""
        }`}
        value={selectedItem?.[field] || ""}
        onChange={(e) =>
          setSelectedItem((prev) => ({ ...prev, [field]: e.target.value }))
        }
      />
    </div>
  );

  const DrawerSelect = ({ label, field, options }) => (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        className="w-full border p-2 rounded-lg mt-1"
        value={selectedItem?.[field] || ""}
        onChange={(e) =>
          setSelectedItem((prev) => ({ ...prev, [field]: e.target.value }))
        }>
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.busId || opt.driverId || opt.routeName}
          </option>
        ))}
      </select>
    </div>
  );

  const renderFormFields = (normalizedType) => {
    switch (normalizedType) {
      case "student":
        return (
          <>
            <Input label="Name" field="name" setNewItem={setNewItem} />
            <Input label="Email" field="email" setNewItem={setNewItem} />
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
              label="Contact Number"
              field="contactNumber"
              setNewItem={setNewItem}
            />
            <Input label="Address" field="address" setNewItem={setNewItem} />

            <Select
              label="Assigned Bus"
              field="assignedBus"
              options={buses}
              setNewItem={setNewItem}
              display={(opt) => opt.busId}
            />
            <Select
              label="Assigned Route"
              field="assignedRoute"
              options={routes}
              setNewItem={setNewItem}
              display={(opt) => opt.routeName}
            />
          </>
        );

      case "driver":
        return (
          <>
            <Input label="Name" field="name" setNewItem={setNewItem} />
            <Input label="Email" field="email" setNewItem={setNewItem} />
            <Input label="Driver ID" field="driverId" setNewItem={setNewItem} />
            <Input
              label="Contact Number"
              field="contactNumber"
              setNewItem={setNewItem}
            />

            <Select
              label="Assigned Bus"
              field="assignedBus"
              options={buses}
              setNewItem={setNewItem}
              display={(opt) => opt.busId}
            />
            <Select
              label="Assigned Route"
              field="assignedRoute"
              options={routes}
              setNewItem={setNewItem}
              display={(opt) => opt.routeName}
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
              options={drivers}
              setNewItem={setNewItem}
              display={(opt) => opt.driverId}
            />
            <Select
              label="Assigned Route"
              field="assignedRoute"
              options={routes}
              setNewItem={setNewItem}
              display={(opt) => opt.routeName}
            />
          </>
        );
      default:
        return null;
    }
  };

  /* ============================================================
      CARD LABEL HELPERS
  ============================================================ */
  const getAssignedBus = (item) =>
    item.assignedBus?.busId ||
    buses.find((b) => b._id === item.assignedBus)?.busId ||
    "N/A";

  const getAssignedRoute = (item) =>
    item.assignedRoute?.routeName ||
    routes.find((r) => r._id === item.assignedRoute)?.routeName ||
    "N/A";

  const getAssignedDriver = (item) =>
    item.assignedDriver?.driverId ||
    drivers.find((d) => d._id === item.assignedDriver)?.driverId ||
    "N/A";

  /* ============================================================
      RENDER UI
  ============================================================ */
  return (
    <div className="w-[80%] ml-16 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-indigo-900">{formattedType}s</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-xl flex gap-2">
          <FaPlus /> Add {formattedType}
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-4 max-w-md">
        <FaSearch className="absolute ml-3 mt-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              setSelectedItem(item);
              setShowDrawer(true);
            }}
            className="cursor-pointer border shadow-md rounded-xl p-4 bg-white hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-800">
              {item.name || item.driverId || item.busId}
            </h3>

            <p className="text-sm text-gray-600">
              {item.enrollmentId || item.driverId || item.busNumberPlate}
            </p>

            {(normalizedType === "student" || normalizedType === "driver") && (
              <div className="text-sm mt-2 space-y-1">
                <p>
                  <strong>Bus:</strong> {getAssignedBus(item)}
                </p>
                <p>
                  <strong>Route:</strong> {getAssignedRoute(item)}
                </p>
              </div>
            )}

            {normalizedType === "bus" && (
              <div className="text-sm mt-2 space-y-1">
                <p>
                  <strong>Driver:</strong> {getAssignedDriver(item)}
                </p>
                <p>
                  <strong>Route:</strong> {getAssignedRoute(item)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DRAWER */}
      {showDrawer && selectedItem && (
        <div className="fixed inset-0 flex justify-end bg-black/30">
          <div className="w-[380px] bg-white h-full shadow-xl p-6 overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setShowDrawer(false)}>
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">
              Edit {formattedType}
            </h2>

            <div className="space-y-4">
              {normalizedType === "student" && (
                <>
                  <DrawerField label="Name" field="name" />
                  <DrawerField label="Email" field="email" disabled />
                  <DrawerField
                    label="Enrollment ID"
                    field="enrollmentId"
                    disabled
                  />
                  <DrawerField label="Contact Number" field="contactNumber" />
                  <DrawerField label="Address" field="address" />
                  <DrawerSelect
                    label="Assigned Bus"
                    field="assignedBus"
                    options={buses}
                  />
                  <DrawerSelect
                    label="Assigned Route"
                    field="assignedRoute"
                    options={routes}
                  />
                </>
              )}

              {normalizedType === "driver" && (
                <>
                  <DrawerField label="Name" field="name" />
                  <DrawerField label="Email" field="email" disabled />
                  <DrawerField label="Driver ID" field="driverId" disabled />
                  <DrawerField label="Contact Number" field="contactNumber" />
                  <DrawerSelect
                    label="Assigned Bus"
                    field="assignedBus"
                    options={buses}
                  />
                  <DrawerSelect
                    label="Assigned Route"
                    field="assignedRoute"
                    options={routes}
                  />
                </>
              )}

              {normalizedType === "bus" && (
                <>
                  <DrawerField label="Bus ID" field="busId" />
                  <DrawerField
                    label="Bus Number Plate"
                    field="busNumberPlate"
                  />
                  <DrawerSelect
                    label="Assigned Driver"
                    field="assignedDriver"
                    options={drivers}
                  />
                  <DrawerSelect
                    label="Assigned Route"
                    field="assignedRoute"
                    options={routes}
                  />
                </>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg w-full"
                onClick={handleUpdate}>
                <FaSave className="inline mr-1" /> Save
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
                onClick={() => deleteItem(selectedItem._id)}>
                <FaTrash className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] relative">
            <button
              className="absolute top-4 right-4 text-xl"
              onClick={() => setShowForm(false)}>
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4">
              Add New {formattedType}
            </h2>

            <form className="space-y-4" onSubmit={handleAddNew}>
              {renderFormFields(normalizedType)}

              <button className="bg-yellow-500 text-white w-full py-2 rounded-lg mt-4">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
      INPUT COMPONENT
============================================================ */
function Input({ label, field, type = "text", setNewItem }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        className="w-full border p-2 rounded-lg"
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
        }
      />
    </div>
  );
}

/* ============================================================
      SELECT COMPONENT
============================================================ */
function Select({ label, field, options, setNewItem, display }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        className="w-full border p-2 rounded-lg"
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
        }>
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {display(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
