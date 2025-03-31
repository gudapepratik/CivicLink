import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Map,
  AdvancedMarker,
  useMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import config from "../../../config/config";

const GoogleMapReportCluster = ({pois}) => {
  const map = useMap();
  const [markers, setMarkers] = useState({});
  const clusterer = useRef(null);

  // Initialize MarkerClusterer only once when map is available
  useEffect(() => {
    if (map && !clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers when markers change
  useEffect(() => {
    if (clusterer.current) {
      clusterer.current.clearMarkers();
      clusterer.current.addMarkers(Object.values(markers));
    }
  }, [markers]);

  // Store marker references efficiently
  const setMarkerRef = useCallback((marker, key) => {
    setMarkers((prev) => {
      if (!marker) {
        const updatedMarkers = { ...prev };
        delete updatedMarkers[key];
        return updatedMarkers;
      }
      return { ...prev, [key]: marker };
    });
  }, []);

  if (!map) return null;

  return (
    <>
      {pois.map((poi,index) => (
        <AdvancedMarker
          key={index}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, index)}
        >
          <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default GoogleMapReportCluster;
// import {
//     GoogleMap,
//     LoadScript,
//     Marker,
//     useLoadScript,
//   } from "@react-google-maps/api";
//   import { useState } from "react";
//   import config from "../../../config/config";

//   const mapContainerStyle = {
//     width: "100%",
//     height: "200px",
//     borderRadius: "10px",
//   };

//   const defaultCenter = {
//     lat: 18.5204,
//     lng: 73.8567,
//   };

//   const GoogleMapsViewLocation = ({ latitude, longitude, address }) => {
//     // const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default: Pune
//     const [markerPosition, setMarkerPosition] = useState(defaultCenter);

//     const { isLoaded } = useLoadScript({
//       googleMapsApiKey: config.googleMapsApiKey,
//     });

//     const handleMapClick = (event) => {
//       const newPosition = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };
//       setMarkerPosition(newPosition);
//     };

//     // const customStyle = [
//     //   { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
//     //   { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
//     //   { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
//     //   {
//     //     featureType: "administrative.locality",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#d59563" }],
//     //   },
//     //   {
//     //     featureType: "poi",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#d59563" }],
//     //   },
//     //   {
//     //     featureType: "poi.park",
//     //     elementType: "geometry",
//     //     stylers: [{ color: "#263c3f" }],
//     //   },
//     //   {
//     //     featureType: "poi.park",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#6b9a76" }],
//     //   },
//     //   {
//     //     featureType: "road",
//     //     elementType: "geometry",
//     //     stylers: [{ color: "#38414e" }],
//     //   },
//     //   {
//     //     featureType: "road",
//     //     elementType: "geometry.stroke",
//     //     stylers: [{ color: "#212a37" }],
//     //   },
//     //   {
//     //     featureType: "road",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#9ca5b3" }],
//     //   },
//     //   {
//     //     featureType: "road.highway",
//     //     elementType: "geometry",
//     //     stylers: [{ color: "#746855" }],
//     //   },
//     //   {
//     //     featureType: "road.highway",
//     //     elementType: "geometry.stroke",
//     //     stylers: [{ color: "#1f2835" }],
//     //   },
//     //   {
//     //     featureType: "road.highway",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#f3d19c" }],
//     //   },
//     //   {
//     //     featureType: "transit",
//     //     elementType: "geometry",
//     //     stylers: [{ color: "#2f3948" }],
//     //   },
//     //   {
//     //     featureType: "transit.station",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#d59563" }],
//     //   },
//     //   {
//     //     featureType: "water",
//     //     elementType: "geometry",
//     //     stylers: [{ color: "#17263c" }],
//     //   },
//     //   {
//     //     featureType: "water",
//     //     elementType: "labels.text.fill",
//     //     stylers: [{ color: "#515c6d" }],
//     //   },
//     //   {
//     //     featureType: "water",
//     //     elementType: "labels.text.stroke",
//     //     stylers: [{ color: "#17263c" }],
//     //   },
//     // ]

//     if (!isLoaded) return <div className="flex items-center justify-center w-full h-full text-white">Loading Map...</div>;

//     const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address || "Bajirao Road, Shaniwar Peth,Pune, Maharashtra 411030, India")}`;

//     return (
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={markerPosition}
//         options={{disableDefaultUI: true, cameraControl: true, fullscreenControl: true, draggableCursor: true,gestureHandling: "greedy" } }
//         zoom={12}
//       >
//          <Marker position={{ lat: latitude || defaultCenter.lat , lng: longitude || defaultCenter.lng}} />
//       </GoogleMap>
//     );
//   };

//   export default GoogleMapsViewLocation;
