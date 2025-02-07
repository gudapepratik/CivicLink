import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";
import config from "../../../../config/config";

const GoogleMapComponent = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default: Pune

  return (
    <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
      <GoogleMap 
        mapContainerStyle={{ width: "100%", height: "100%" , borderRadius: "10px"}}
        center={mapCenter}
        zoom={12}
        heading={false}
        options={{disableDefaultUI: true}}
        
      >
        {/* Marker Example */}
        <Marker position={mapCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
