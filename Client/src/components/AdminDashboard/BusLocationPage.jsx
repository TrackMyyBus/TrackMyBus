// BusLocationPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/config/api";
import io from "socket.io-client";

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ⭐ NEW LIVE (GREEN) ICON (FontAwesome style)
const greenMarker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7902/7902160.png", // clean green location-dot style
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// ⭐ NEW OFFLINE (RED) ICON (FontAwesome style)
const redMarker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7902/7902180.png", // same icon but tinted red
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  className: "offline-marker", // we tint using CSS
});

export default function BusLocationPage() {
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");
  const [noLiveBus, setNoLiveBus] = useState(false);
  const socketRef = useRef(null);

  // Move map center dynamically
  const FollowBus = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position) map.setView(position, 15);
    }, [position]);
    return null;
  };

  // Update bus coordinates live
  const updateBusCoords = (busId, latitude, longitude) => {
    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId
          ? {
              ...b,
              lat: latitude,
              lng: longitude,
              lastUpdated: Date.now(),
              isLive: true,
            }
          : b
      )
    );
  };

  useEffect(() => {
    const socket = io(API_BASE_URL);
    socketRef.current = socket;

    const adminId = localStorage.getItem("adminId");
    if (!adminId) return;

    (async () => {
      const req = await fetch(`${API_BASE_URL}/api/buses/all/${adminId}`);
      const res = await req.json();

      if (!res.success) return;

      const normalized = res.buses.map((b) => ({
        id: b._id,
        name: b.busNumberPlate,
        driver: b.assignedDriver?.name,
        number: b.busNumberPlate,
        lat: b.currentLocation?.latitude ?? null,
        lng: b.currentLocation?.longitude ?? null,
        lastUpdated: b.currentLocation?.lastUpdated
          ? new Date(b.currentLocation.lastUpdated).getTime()
          : null,
        isLive: false,
      }));

      setBuses(normalized);

      normalized.forEach((bus) => {
        socket.on(`bus-${bus.id}-location`, (payload) => {
          updateBusCoords(bus.id, payload.latitude, payload.longitude);
        });
      });
    })();

    return () => socket.disconnect();
  }, []);

  // Filter to only live buses (updated within last 10 seconds)
  const liveBuses = buses.filter(
    (b) => b.lastUpdated && Date.now() - b.lastUpdated < 10000
  );
  // ⭐ NEW: Use ANY bus with coordinates to center map
  const allValidBuses = buses.filter((b) => b.lat !== null && b.lng !== null);

  const center =
    allValidBuses.length > 0
      ? [Number(allValidBuses[0].lat), Number(allValidBuses[0].lng)]
      : [22.7196, 75.8577]; // default

  useEffect(() => {
    setNoLiveBus(liveBuses.length === 0);
  }, [liveBuses]);

  return (
    <div className="w-full flex flex-col h-[80vh]">
      <h2 className="text-2xl font-extrabold mb-3">🚌 Live Bus Map (Admin)</h2>

      {noLiveBus && (
        <div className="p-3 mb-3 bg-red-100 text-red-700 rounded-lg text-center">
          ⚠️ No bus is currently sharing live location.
        </div>
      )}

      <div className="mb-2 w-3/3">
        <Input
          placeholder="Search bus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 rounded-lg overflow-hidden border shadow-lg">
        <MapContainer center={center} zoom={14} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {liveBuses.map((bus) => (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={greenMarker}>
              <Popup>
                <b>{bus.name}</b> <br />
                Driver: {bus.driver} <br />
                Number: {bus.number} <br />
                Live: Yes
              </Popup>
              <FollowBus position={[bus.lat, bus.lng]} />
            </Marker>
          ))}

          {buses
            .filter((b) => !b.isLive && b.lat && b.lng)
            .map((bus) => (
              <Marker
                key={bus.id}
                position={[bus.lat, bus.lng]}
                icon={redMarker}>
                <Popup>
                  <b>{bus.name}</b> <br />
                  Driver: {bus.driver} <br />
                  Number: {bus.number} <br />
                  Live: No (stale)
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
