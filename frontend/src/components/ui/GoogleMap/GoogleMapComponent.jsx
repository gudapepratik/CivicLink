import { GoogleMap, LoadScript, Marker, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import config from "../../../../config/config";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "10px"
};

const defaultCenter = {
  lat: 18.5204, 
  lng: 73.8567, 
};

const GoogleMapComponent = ({onLocationSelect}) => {
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

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={markerPosition}
      zoom={12}
      onClick={handleMapClick}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
