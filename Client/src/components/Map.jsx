import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // your backend URL

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
  iconSize: [40, 40],
});

export default function Map({ driverId }) {
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 });

  useEffect(() => {
    // Listen for live location updates from backend
    socket.on("locationUpdate", (data) => {
      if (data.driverId === driverId) {
        setLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => socket.off("locationUpdate");
  }, [driverId]);

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[location.lat, location.lng]} icon={busIcon}>
          <Popup>Driver’s Live Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
