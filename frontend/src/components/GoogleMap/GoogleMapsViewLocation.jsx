import {
  GoogleMap,
  LoadScript,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useState } from "react";
import config from "../../../config/config";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "10px",
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567,
};

const GoogleMapsViewLocation = ({ latitude, longitude, address }) => {
  // const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default: Pune
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: config.googleMapsApiKey,
  });

  const handleMapClick = (event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
  };

  if (!isLoaded) return <div className="flex items-center justify-center w-full h-full text-white">Loading Map...</div>;

  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address || "Bajirao Road, Shaniwar Peth,Pune, Maharashtra 411030, India")}`;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center = {latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter}
      options={{disableDefaultUI: true, cameraControl: true, fullscreenControl: true, draggableCursor: true,gestureHandling: "greedy" } }
      zoom={12}
    >
      <Marker position={{ lat: latitude || defaultCenter.lat , lng: longitude || defaultCenter.lng}} />
    </GoogleMap>
  );
};

export default GoogleMapsViewLocation;
