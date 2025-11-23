import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function BusLocationPage({ sidebarOpen }) {
  const [buses, setBuses] = useState([
    // fallback mock data until real buses loaded
    { id: "bus1", lat: 28.6139, lng: 77.209, name: "Bus 1" },
    { id: "bus2", lat: 28.5355, lng: 77.391, name: "Bus 2" },
  ]);
  const [search, setSearch] = useState("");
  const socketRef = useRef(null);

  // helper: update a single bus coords by id
  const updateBusCoords = (busId, lat, lng) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId
          ? { ...bus, lat: lat ?? bus.lat, lng: lng ?? bus.lng }
          : bus
      )
    );
  };

  useEffect(() => {
    // create socket once
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socketRef.current = socket;

    // fetch buses from backend and initialize markers
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/buses");
        if (!res.ok) throw new Error("Failed to fetch buses");
        const data = await res.json();

        // map to our shape. backend Bus model should include _id and currentLocation
        const normalized = data.map((b) => {
          const current = b.currentLocation || {};
          return {
            id: b._id || b.id,
            name:
              b.busNumber || b.busId || b.registrationNumber || `Bus ${b._id}`,
            lat:
              current.latitude ??
              current.lat ??
              b.startPoint?.latitude ??
              28.6139,
            lng:
              current.longitude ??
              current.lng ??
              b.startPoint?.longitude ??
              77.209,
            raw: b,
          };
        });

        if (Array.isArray(normalized) && normalized.length)
          setBuses(normalized);

        // Subscribe to bus-specific socket channels (one listener per bus)
        normalized.forEach((bus) => {
          const eventName = `bus-${bus.id}-location`;
          socket.on(eventName, (payload) => {
            // payload expected: { latitude, longitude, speed, heading, timestamp }
            const lat = payload.latitude ?? payload.lat;
            const lng = payload.longitude ?? payload.lng;
            if (lat != null && lng != null) updateBusCoords(bus.id, lat, lng);
          });
        });
      } catch (err) {
        // keep fallback buses if fetch fails
        console.error("Error fetching buses:", err);
      }
    })();

    // ALSO listen to generic events (tolerant)
    const genericHandler = (payload) => {
      // payload might be: { id, lat, lng } or { busId, latitude, longitude } or { bus: 'id', latitude, longitude }
      if (!payload) return;
      const busId =
        payload.id ||
        payload.busId ||
        (payload.bus && (payload.bus._id || payload.bus));
      const lat = payload.latitude ?? payload.lat;
      const lng = payload.longitude ?? payload.lng;
      if (busId && lat != null && lng != null) updateBusCoords(busId, lat, lng);
    };

    socket.on("location-update", genericHandler);
    socket.on("busLocationUpdate", genericHandler);
    socket.on("updateLocation", genericHandler); // for older naming

    // cleanup on unmount
    return () => {
      // remove listeners that were registered for each bus
      if (socketRef.current) {
        socketRef.current.off("location-update", genericHandler);
        socketRef.current.off("busLocationUpdate", genericHandler);
        socketRef.current.off("updateLocation", genericHandler);

        // also remove bus-specific listeners to be safe
        buses.forEach((bus) => {
          const eventName = `bus-${bus.id}-location`;
          socketRef.current.off(eventName);
        });

        socketRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const filteredBuses = buses.filter((bus) =>
    bus.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`p-4 flex flex-col h-[100vh] transition-all duration-300`}
      style={{ marginLeft: sidebarOpen ? "16rem" : "4rem" }} // 16rem = 256px, 4rem = 64px
    >
      <h2 className="text-3xl font-extrabold text-indigo-900 mb-3">
        🗺️ Live Bus Locations
      </h2>

      <Input
        placeholder="Search Bus ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full md:w-1/3"
      />

      <div className="flex-1 rounded-lg overflow-hidden shadow-lg border">
        <MapContainer
          center={[
            filteredBuses[0]?.lat ?? 28.6139,
            filteredBuses[0]?.lng ?? 77.209,
          ]}
          zoom={12}
          style={{ height: "96%", width: "96%", margin: "20px" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {filteredBuses.map((bus) => (
            <Marker key={bus.id} position={[bus.lat, bus.lng]}>
              <Popup>
                <b>{bus.name}</b> <br />
                ID: {bus.id} <br />
                Lat: {Number(bus.lat).toFixed(5)}, Lng:{" "}
                {Number(bus.lng).toFixed(5)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
