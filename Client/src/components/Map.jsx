import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";
import { API_BASE_URL } from "@/config/api";

// Blue Marker Icon
const blueMarker = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // blue location marker
  iconAnchor: [20, 40],
});

// Socket
const socket = io(API_BASE_URL);

// Component: auto-center map when marker updates
function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng]);
  return null;
}

export default function Map({ location, busId, height = "350px" }) {
  const [liveLocation, setLiveLocation] = useState(location);

  // Update from DriverDashboard props
  useEffect(() => {
    if (location) {
      setLiveLocation(location);
    }
  }, [location]);

  // Listen for server socket updates (admin + student also use this)
  useEffect(() => {
    if (!busId) return;

    const eventName = `bus-${busId}-location`;

    socket.on(eventName, (data) => {
      setLiveLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    return () => socket.off(eventName);
  }, [busId]);

  // Coordinates fallback
  const lat = liveLocation?.latitude ?? 22.7196;
  const lng = liveLocation?.longitude ?? 75.8577;

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}>
        {/* Map Layer */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Follow Bus */}
        <Recenter lat={lat} lng={lng} />

        {/* Blue Marker */}
        <Marker position={[lat, lng]} icon={blueMarker}>
          <Popup>Live Bus Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
