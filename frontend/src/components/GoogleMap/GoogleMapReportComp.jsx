import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import config from "../../../config/config";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "3%"
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const InfoComponent = ({ loc, markerDetails, setActiveMarkerIndex }) => {
  return (
    <InfoWindow
      position={{ lat: loc.lat, lng: loc.lng }}
      onCloseClick={() => setActiveMarkerIndex(null)}
    >
      <div className="flex flex-col gap-1 items-center">
        <img
          src={markerDetails.avatar}
          alt="avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
        <h4 className="font-outfit text-zinc-800 text-xs w-32 text-wrap">
          {markerDetails.title.length > 30
            ? markerDetails.title.slice(0, 30) + "..."
            : markerDetails.title}
        </h4>
        <button
          onClick={() => (window.location.href = markerDetails.link)}
          className="w-full bg-zinc-800 dark:bg-zinc-800 dark:bg-opacity-75 dark:hover:bg-opacity-100 hover:bg-zinc-950 text-white font-outfit font-bold p-2 rounded-sm"
        >
          View Post
        </button>
      </div>
    </InfoWindow>
  );
};

const GoogleMapReportComp = ({ locations, markerDetails }) => {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: config.googleMapsApiKey, // replace with your API key
  });

  const handleMarkerClick = (position, index) => {
    if (mapRef) {
      mapRef.panTo(position);
      mapRef.setZoom(15);
    }
    setActiveMarkerIndex(index);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative z-[100] rounded-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={5}
        onLoad={(map) => setMapRef(map)}
      >
        {locations &&
          locations.map((loc, index) => (
            <Marker
              key={index}
              position={{ lat: loc.lat, lng: loc.lng }}
              onClick={() =>
                handleMarkerClick({ lat: loc.lat, lng: loc.lng }, index)
              }
            >
              {activeMarkerIndex === index && (
                <InfoWindow
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onCloseClick={() => setActiveMarkerIndex(null)}
                >
                  <div className="flex flex-col gap-1 items-center">
                    <img
                      src={markerDetails[index].avatar}
                      alt="avatar"
                      style={{ width: 50, height: 50, borderRadius: "50%" }}
                    />
                    <h4 className="font-outfit text-zinc-800 text-xs w-32 text-wrap">
                      {markerDetails[index].title.length > 30
                        ? markerDetails[index].title.slice(0, 30) + "..."
                        : markerDetails[index].title}
                    </h4>
                    <button
                      onClick={() =>
                        (window.location.href = markerDetails[index].link)
                      }
                      className="w-full bg-zinc-800 dark:bg-zinc-800 dark:bg-opacity-75 dark:hover:bg-opacity-100 hover:bg-zinc-950 text-white font-outfit font-bold p-2 rounded-sm"
                    >
                      View Post
                    </button>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
      </GoogleMap>

    </div>
  );
};

export default GoogleMapReportComp;

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
