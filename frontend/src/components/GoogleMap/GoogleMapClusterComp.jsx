"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState, useRef, useCallback } from "react";
import config from "../../../config/config";

const reports = [
  { id: 1, lat: 18.5204, lng: 73.8567, name: "Shivajinagar" },
  { id: 2, lat: 18.5314, lng: 73.8446, name: "Deccan Gymkhana" },
  { id: 3, lat: 18.5105, lng: 73.8561, name: "Swargate" },
  { id: 4, lat: 18.5669, lng: 73.9161, name: "Viman Nagar" },
  { id: 5, lat: 18.5018, lng: 73.8215, name: "Kothrud" },
];

export default function GoogleMapClusterComp() {
  // Prevent touch event propagation
  const containerStyle = {
    height: "500px", 
    width: "100%",  
    touchAction: "none" // Prevent browser from handling touch events
  };

  return (
    <div style={containerStyle} className="map-container">
      <APIProvider apiKey={config.googleMapsApiKey}>
        <Map
          defaultCenter={{ lat: 18.5204, lng: 73.8567 }}
          defaultZoom={12}
          mapId={config.googleMapsClusterMapId}
          gestureHandling="auto"
          disableDefaultUI={false}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            gestureHandling: "greedy",
            scrollwheel: true,
            clickableIcons: false,
          }}
        >
          <MapMarkers />
        </Map>
      </APIProvider>
    </div>
  );
}

// Separate component for markers to prevent re-renders
const MapMarkers = () => {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const markersRef = useRef({});
  
  // Memoize handlers to prevent recreation on each render
  const handleMarkerClick = useCallback((id) => {
    setSelectedReportId(id);
  }, []);
  
  const handleInfoWindowClose = useCallback(() => {
    setSelectedReportId(null);
  }, []);
  
  // Register marker ref through callback rather than JSX ref
  const registerMarkerRef = useCallback((id, marker) => {
    if (marker) {
      markersRef.current[id] = marker;
    }
  }, []);

  return (
    <>
      {reports.map((report) => (
        <AdvancedMarker
          key={report.id}
          position={{ lat: report.lat, lng: report.lng }}
          onClick={() => handleMarkerClick(report.id)}
          ref={(marker) => registerMarkerRef(report.id, marker)}
        >
          <span role="img" aria-label="pin">📍</span>
        </AdvancedMarker>
      ))}

      {selectedReportId && markersRef.current[selectedReportId] && (
        <InfoWindow
          anchor={markersRef.current[selectedReportId]}
          onCloseClick={handleInfoWindowClose}
          options={{ pixelOffset: { width: 0, height: -35 } }}
        >
          <div style={{ padding: "5px" }}>
            {reports.find((r) => r.id === selectedReportId)?.name}
          </div>
        </InfoWindow>
      )}
    </>
  );
};



// "use client";

// import {
//   APIProvider,
//   Map,
//   useMap,
//   AdvancedMarker,
//   InfoWindow,
// } from "@vis.gl/react-google-maps";
// import { MarkerClusterer } from "@googlemaps/markerclusterer";
// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import config from "../../../config/config";

// const reports = [
//   { id: 1, lat: 18.5204, lng: 73.8567, name: "Shivajinagar" },
//   { id: 2, lat: 18.5314, lng: 73.8446, name: "Deccan Gymkhana" },
//   { id: 3, lat: 18.5105, lng: 73.8561, name: "Swargate" },
//   { id: 4, lat: 18.5669, lng: 73.9161, name: "Viman Nagar" },
//   { id: 5, lat: 18.5018, lng: 73.8215, name: "Kothrud" },
// ];

// export default function ReportMap() {
//   return (
//     <div style={{ height: "500px", width: "100%" }}>
//       <APIProvider apiKey={config.googleMapsApiKey}>
//         <Map
//           center={{ lat: 18.5204, lng: 73.8567 }}
//           zoom={12}
//           mapId={config.googleMapsClusterMapId}
//           gestureHandling="auto" // ✅ FIX: Allows proper touch and scroll behavior
//           disableDefaultUI={false} // ✅ FIX: Enables UI elements for smoother interaction
//         >
//           <ClusteredReportMarkers reports={reports} />
//         </Map>
//       </APIProvider>
//     </div>
//   );
// }

// const ClusteredReportMarkers = ({ reports }) => {
//   const [markers, setMarkers] = useState({});
//   const [selectedReportId, setSelectedReportId] = useState(null);
//   const map = useMap();
//   const clustererRef = useRef(null);

//   const selectedReport = useMemo(
//     () => reports.find((r) => r.id === selectedReportId) || null,
//     [reports, selectedReportId]
//   );

//   useEffect(() => {
//     if (map && !clustererRef.current) {
//       clustererRef.current = new MarkerClusterer({ map });
//     }
//   }, [map]);

//   useEffect(() => {
//     if (!clustererRef.current) return;
//     clustererRef.current.clearMarkers();
//     clustererRef.current.addMarkers(Object.values(markers));
//   }, [markers]);

//   const setMarkerRef = useCallback((marker, id) => {
//     if (!marker) return;
//     setMarkers((prev) => {
//       if (prev[id] === marker) return prev;
//       return { ...prev, [id]: marker };
//     });
//   }, []);

//   const handleInfoWindowClose = () => {
//     setSelectedReportId(null);
//   };

//   const handleMarkerClick = (report) => {
//     setSelectedReportId(report.id);
//   };

//   return (
//     <>
//       {reports.map((report) => (
//         <ReportMarker
//           key={report.id}
//           report={report}
//           onClick={handleMarkerClick}
//           setMarkerRef={setMarkerRef}
//         />
//       ))}

//       {selectedReport && markers[selectedReportId] && (
//         <InfoWindow
//           anchor={markers[selectedReportId]}
//           onCloseClick={handleInfoWindowClose}
//         >
//           {selectedReport.name}
//         </InfoWindow>
//       )}
//     </>
//   );
// };

// const ReportMarker = ({ report, onClick, setMarkerRef }) => {
//   const markerRef = useRef(null);

//   useEffect(() => {
//     if (markerRef.current) {
//       setMarkerRef(markerRef.current, report.id);
//     }
//   }, [markerRef, setMarkerRef, report.id]);

//   return (
//     <AdvancedMarker
//       position={{ lat: report.lat, lng: report.lng }}
//       onClick={(e) => {
//         if(e.domEvent.cancelable)
//           e.domEvent.preventDefault()
//         console.log(e)
//         onClick(report)
//       }}
//       ref={markerRef} // ✅ FIX: Avoids infinite updates by using useRef
//     >
//       📍
//     </AdvancedMarker>
//   );
// };
