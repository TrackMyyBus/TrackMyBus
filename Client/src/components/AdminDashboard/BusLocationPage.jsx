import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function BusLocationPage() {
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");
  const socketRef = useRef(null);

  const updateBusCoords = (busId, lat, lng) => {
    setBuses((prev) =>
      prev.map((bus) => (bus.id === busId ? { ...bus, lat, lng } : bus))
    );
  };

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["polling", "websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      timeout: 20000,
    });

    socketRef.current = socket;

    const adminId = localStorage.getItem("adminId");
    if (!adminId) {
      console.error("No adminId found!");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bus/all/${adminId}`);
        const raw = await res.json();
        if (!raw.success || !Array.isArray(raw.buses)) return;
        const normalized = raw.buses.map((b) => {
          const loc = b.currentLocation || {};
          return {
            id: b._id,
            name: b.busId || b.busNumberPlate || "Bus",
            lat: loc.latitude ?? 22.621,
            lng: loc.longitude ?? 75.8036,
            raw: b,
          };
        });
        setBuses(normalized);
        normalized.forEach((bus) => {
          socket.on(`bus-${bus.id}-location`, (payload) => {
            if (!payload) return;
            updateBusCoords(
              bus.id,
              payload.latitude ?? payload.lat,
              payload.longitude ?? payload.lng
            );
          });
        });
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    })();

    return () => socket.disconnect();
  }, []);

  const filteredBuses = buses.filter((b) =>
    (b.name + b.id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col h-[75vh] sm:h-[80vh]">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-3">
        🗺️ Live Bus Locations
      </h2>

      <div className="mb-3 w-full sm:w-1/2 lg:w-1/3">
        <Input
          placeholder="Search Bus ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 rounded-lg overflow-hidden shadow-lg border">
        <MapContainer
          center={[
            filteredBuses[0]?.lat ?? 22.621,
            filteredBuses[0]?.lng ?? 75.8036,
          ]}
          zoom={12}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {filteredBuses.map((bus) => (
            <Marker key={bus.id} position={[bus.lat, bus.lng]}>
              <Popup>
                <b>{bus.name}</b> <br />
                ID: {bus.id} <br />
                Lat: {bus.lat.toFixed(5)} <br />
                Lng: {bus.lng.toFixed(5)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
