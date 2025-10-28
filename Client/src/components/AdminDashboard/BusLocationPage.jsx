import React, { useState, useEffect } from "react";
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

export default function BusLocationPage() {
  const [buses, setBuses] = useState([
    { id: "bus1", lat: 28.6139, lng: 77.209, name: "Bus 1" },
    { id: "bus2", lat: 28.5355, lng: 77.391, name: "Bus 2" },
  ]);
  const [search, setSearch] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // your backend URL
    setSocket(newSocket);

    // Listen for real-time location updates
    newSocket.on("busLocationUpdate", (data) => {
      setBuses((prev) =>
        prev.map((bus) =>
          bus.id === data.id ? { ...bus, lat: data.lat, lng: data.lng } : bus
        )
      );
    });

    return () => newSocket.close();
  }, []);

  const filteredBuses = buses.filter((bus) =>
    bus.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col ml-16 h-[100%] w-[80%]">
      <h2 className="text-3xl font-extrabold text-indigo-900  mb-3">
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
          center={[28.6139, 77.209]} // Default: Delhi
          zoom={12}
          style={{
            height: "96%",
            width: "96%",
            margin: "20px",
          }}
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
                Lat: {bus.lat.toFixed(3)}, Lng: {bus.lng.toFixed(3)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
