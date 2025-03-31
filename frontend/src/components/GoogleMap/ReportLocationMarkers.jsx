import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ReportMarker } from "./ReportMarker"; // Component to display markers

export type ClusteredReportMarkersProps = {
  reports: { id: number; lat: number; lng: number; name: string }[];
};

/**
 * The ClusteredReportMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredReportMarkers = ({ reports }: ClusteredReportMarkersProps) => {
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.Marker }>({});
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const selectedReport = useMemo(
    () => (selectedReportId ? reports.find((r) => r.id === selectedReportId) : null),
    [reports, selectedReportId]
  );

  // Initialize map and marker clusterer
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;
    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: google.maps.Marker | null, id: number) => {
    setMarkers((prevMarkers) => {
      if ((marker && prevMarkers[id]) || (!marker && !prevMarkers[id])) return prevMarkers;
      
      if (marker) {
        return { ...prevMarkers, [id]: marker };
      } else {
        const { [id]: _, ...newMarkers } = prevMarkers;
        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedReportId(null);
  }, []);

  const handleMarkerClick = useCallback((report: { id: number }) => {
    setSelectedReportId(report.id);
  }, []);

  return (
    <>
      {reports.map((report) => (
        <ReportMarker
          key={report.id}
          report={report}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {selectedReportId && (
        <InfoWindow anchor={markers[selectedReportId]} onCloseClick={handleInfoWindowClose}>
          {selectedReport?.name}
        </InfoWindow>
      )}
    </>
  );
};
