import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTrash, FaSave } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

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
    bus: "/api/buses",
  };

  const apiPrefix = API_PREFIX_MAP[normalizedType];

  /* ---------------------------------------------
     CREATE (ADD NEW)
  --------------------------------------------- */
  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!adminId) return alert("Admin ID missing!");

    let payload = { ...newItem, institute: adminId };

    if (normalizedType === "driver")
      payload.password = newItem.password || newItem.driverId;

    try {
      await axios.post(`${API_BASE_URL}${apiPrefix}/create`, payload, {
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

  /* ---------------------------------------------
     UPDATE
  --------------------------------------------- */
  const handleUpdate = async () => {
    try {
      /** STUDENT UPDATE */
      if (normalizedType === "student") {
        await axios.put(
          `${API_BASE_URL}/api/students/assign/${selectedItem._id}`,
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

      /** DRIVER UPDATE */
      if (normalizedType === "driver") {
        await axios.put(
          `${API_BASE_URL}/api/drivers/assign/${selectedItem._id}`,
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

      /** BUS UPDATE */
      if (normalizedType === "bus") {
        const busId = selectedItem._id;

        if (selectedItem.assignedDriver) {
          await axios.put(
            `${API_BASE_URL}/api/buses/assign-driver/${busId}`,
            { driverId: selectedItem.assignedDriver },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        if (selectedItem.assignedRoute) {
          await axios.put(
            `${API_BASE_URL}/api/buses/assign-route/${busId}`,
            { routeId: selectedItem.assignedRoute },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        alert("Bus updated (Driver/Route Assigned)");
        setShowDrawer(false);
        refreshData();
        return;
      }

      /** GENERIC UPDATE */
      await axios.put(
        `${API_BASE_URL}${apiPrefix}/update/${selectedItem._id}`,
        selectedItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`${formattedType} updated!`);
      setShowDrawer(false);
      refreshData();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  /* ---------------------------------------------
     DELETE
  --------------------------------------------- */
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await axios.delete(`${API_BASE_URL}${apiPrefix}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      refreshData();
      alert("Deleted!");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  /* ---------------------------------------------
     SEARCH
  --------------------------------------------- */
  const filteredItems = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------------------------------------
     DRAWER INPUT FIELD
  --------------------------------------------- */
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

  /* ---------------------------------------------
     DRAWER SELECT
  --------------------------------------------- */
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
            {opt.busId || opt.driverId || opt.routeName || opt.name}
          </option>
        ))}
      </select>
    </div>
  );

  /* ---------------------------------------------
     FORM FIELDS
  --------------------------------------------- */
  const renderFormFields = (type) => {
    switch (type) {
      case "student":
        return (
          <>
            <FormInput label="Name" field="name" setNewItem={setNewItem} />
            <FormInput label="Email" field="email" setNewItem={setNewItem} />
            <FormInput
              label="Enrollment ID"
              field="enrollmentId"
              setNewItem={setNewItem}
            />
            <FormInput
              label="Enrollment Year"
              field="enrollmentYear"
              type="number"
              setNewItem={setNewItem}
            />
            <FormInput
              label="Contact Number"
              field="contactNumber"
              setNewItem={setNewItem}
            />
            <FormInput
              label="Address"
              field="address"
              setNewItem={setNewItem}
            />

            <FormSelect
              label="Assigned Bus"
              field="assignedBus"
              options={buses}
              setNewItem={setNewItem}
              display={(o) => o.busId || o.busNumberPlate}
            />

            <FormSelect
              label="Assigned Route"
              field="assignedRoute"
              options={routes}
              setNewItem={setNewItem}
              display={(o) => o.routeName}
            />
          </>
        );

      case "driver":
        return (
          <>
            <FormInput label="Name" field="name" setNewItem={setNewItem} />
            <FormInput label="Email" field="email" setNewItem={setNewItem} />
            <FormInput
              label="Driver ID"
              field="driverId"
              setNewItem={setNewItem}
            />
            <FormInput
              label="Contact Number"
              field="contactNumber"
              setNewItem={setNewItem}
            />

            <FormSelect
              label="Assigned Bus"
              field="assignedBus"
              options={buses}
              setNewItem={setNewItem}
              display={(o) => o.busId || o.busNumberPlate}
            />

            <FormSelect
              label="Assigned Route"
              field="assignedRoute"
              options={routes}
              setNewItem={setNewItem}
              display={(o) => o.routeName}
            />
          </>
        );

      case "bus":
        return (
          <>
            <FormInput label="Bus ID" field="busId" setNewItem={setNewItem} />
            <FormInput
              label="Bus Number Plate"
              field="busNumberPlate"
              setNewItem={setNewItem}
            />

            <FormSelect
              label="Assigned Driver"
              field="assignedDriver"
              options={drivers}
              setNewItem={setNewItem}
              display={(o) => o.driverId || o.name}
            />

            <FormSelect
              label="Assigned Route"
              field="assignedRoute"
              options={routes}
              setNewItem={setNewItem}
              display={(o) => o.routeName}
            />
          </>
        );

      default:
        return null;
    }
  };

  /* ---------------------------------------------
     HELPERS FOR CARD UI
  --------------------------------------------- */
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

  /* ---------------------------------------------
     RENDER UI
  --------------------------------------------- */
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-900">
          {formattedType}s
        </h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border rounded-xl shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl flex gap-2">
            <FaPlus /> Add {formattedType}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => {
              setSelectedItem(item);
              setShowDrawer(true);
            }}
            className="cursor-pointer border shadow-sm rounded-xl p-4 bg-white hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-indigo-800">
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

      {/* Drawer */}
      {showDrawer && selectedItem && (
        <div className="fixed inset-0 flex justify-end z-50 bg-black/30">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white h-full shadow-xl p-6 overflow-y-auto">
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

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
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

              <button className="bg-yellow-500 text-white w-full py-2 rounded-lg mt-2">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------
   SMALL HELPERS
--------------------------------------------------- */
function FormInput({ label, field, type = "text", setNewItem }) {
  return (
    <div>
      <label className="text-sm block text-gray-700 mb-1">{label}</label>

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

function FormSelect({
  label,
  field,
  options = [],
  setNewItem,
  display = (o) => o.name,
}) {
  const safe = Array.isArray(options) ? options : [];

  return (
    <div>
      <label className="text-sm block text-gray-700 mb-1">{label}</label>

      <select
        className="w-full border p-2 rounded-lg"
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [field]: e.target.value }))
        }>
        <option value="">Select</option>

        {safe.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {display(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}
