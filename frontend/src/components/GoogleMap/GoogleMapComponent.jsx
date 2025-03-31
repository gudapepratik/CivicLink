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

const GoogleMapComponent = ({ onLocationSelect }) => {
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

  

  // const customStyle = [
  //   { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  //   { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  //   { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  //   {
  //     featureType: "administrative.locality",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#d59563" }],
  //   },
  //   {
  //     featureType: "poi",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#d59563" }],
  //   },
  //   {
  //     featureType: "poi.park",
  //     elementType: "geometry",
  //     stylers: [{ color: "#263c3f" }],
  //   },
  //   {
  //     featureType: "poi.park",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#6b9a76" }],
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "geometry",
  //     stylers: [{ color: "#38414e" }],
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "geometry.stroke",
  //     stylers: [{ color: "#212a37" }],
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#9ca5b3" }],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "geometry",
  //     stylers: [{ color: "#746855" }],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "geometry.stroke",
  //     stylers: [{ color: "#1f2835" }],
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#f3d19c" }],
  //   },
  //   {
  //     featureType: "transit",
  //     elementType: "geometry",
  //     stylers: [{ color: "#2f3948" }],
  //   },
  //   {
  //     featureType: "transit.station",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#d59563" }],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "geometry",
  //     stylers: [{ color: "#17263c" }],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#515c6d" }],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "labels.text.stroke",
  //     stylers: [{ color: "#17263c" }],
  //   },
  // ]

  if (!isLoaded) return <div className="flex items-center justify-center w-full h-full text-white">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={markerPosition}
      options={{disableDefaultUI: true, cameraControl: true, fullscreenControl: true, draggableCursor: true,gestureHandling: "greedy" } }
      zoom={12}
    >
      {pois.map((item, index) => (
        <Marker key={item.key} position={{lat: item.location.lat, lng: item.location.lng}} />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
