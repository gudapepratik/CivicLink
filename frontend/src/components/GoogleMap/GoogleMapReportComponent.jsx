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

const GoogleMapReportComponent = ({ onLocationSelect }) => {
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
    onLocationSelect(newPosition); // Send location to parent form
  };

  const pois = [
    { key: "1", location: { lat: -31.56391, lng: 147.154312 } },
    { key: "2", location: { lat: -33.718234, lng: 150.363181 } },
    { key: "3", location: { lat: -33.727111, lng: 150.371124 } },
    { key: "4", location: { lat: -33.848588, lng: 151.209834 } },
  ];

  if (!isLoaded) return <div className="flex items-center justify-center w-full h-full text-white">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={markerPosition}
      options={{disableDefaultUI: true, cameraControl: true, fullscreenControl: true, draggableCursor: true,gestureHandling: "greedy" } }
      zoom={12}
      onClick={handleMapClick}
    >
        <Marker  position={{lat: markerPosition.lat, lng: markerPosition.lng}} />
    </GoogleMap>
  );
};

export default GoogleMapReportComponent;
