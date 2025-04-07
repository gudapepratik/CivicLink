import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Custom hook to fly to marker
const FlyToMarker = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.flyTo(position, 15); // zoom level 15
    }
  }, [position, map]);
  return null;
};

// Main Component
const ReportMapLeaflet = ({ locations, markerDetails }) => {
  const [activeMarker, setActiveMarker] = React.useState(null);

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Default center (India)
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {locations && locations.map((loc, idx) => {
        const details = markerDetails[idx];
        return (
          <Marker
            key={loc.lat}
            position={[loc.lat, loc.lng]}
            eventHandlers={{
              click: () => {
                setActiveMarker([loc.lat, loc.lng]);
              },
            }}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -30],
            })}
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <img
                  src={details.avatar}
                  alt="user"
                  style={{ width: 50, height: 50, borderRadius: "50%" }}
                />
                <h4 style={{ margin: "10px 0" }}>{details.title}</h4>
                <button
                  onClick={() => window.location.href = details.link}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go to
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {activeMarker && <FlyToMarker position={activeMarker} />}
    </MapContainer>
  );
};

export default ReportMapLeaflet;
