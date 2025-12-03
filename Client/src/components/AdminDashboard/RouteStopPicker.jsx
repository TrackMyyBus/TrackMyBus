import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [30, 30],
});

export default function RouteStopPicker({ onSelect }) {
  const [position, setPosition] = useState(null);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[22.7196, 75.8577]} // Indore default
      zoom={13}
      style={{ height: "350px", width: "100%", borderRadius: "10px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <LocationSelector />

      {position && (
        <Marker position={position} icon={markerIcon}>
          <Popup>
            Lat: {position.lat.toFixed(5)}
            <br />
            Lng: {position.lng.toFixed(5)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
