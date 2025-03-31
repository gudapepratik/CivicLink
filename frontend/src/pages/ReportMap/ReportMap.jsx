import GoogleMapClusterComp from '@/components/GoogleMap/GoogleMapClusterComp';
import GoogleMapComponent from '@/components/GoogleMap/GoogleMapComponent';
import GoogleMapReportCluster from '@/components/GoogleMap/GoogleMapReportCluster'
import React from 'react'

function ReportMap({markers}) {
  const pois = [
    { key: "1", location: { lat: -31.56391, lng: 147.154312 } },
    { key: "2", location: { lat: -33.718234, lng: 150.363181 } },
    { key: "3", location: { lat: -33.727111, lng: 150.371124 } },
    { key: "4", location: { lat: -33.848588, lng: 151.209834 } },
  ];
  return (
    <>
        <div className='flex flex-col gap-3 justify-center w-full font-outfit'>
            <h1 className='text-xl text-zinc-800  dark:text-white font-bold'>Nearby reports</h1>
            <GoogleMapComponent/>
        </div>
    </>
  )
}

export default ReportMap