import React from 'react'
import GoogleMapReportComp from '@/components/GoogleMap/GoogleMapReportComp';

function ReportMap({markerDetails, locations}) {

  return (
    <>
        <div className='flex flex-col gap-3 justify-center w-full font-outfit'>
            <h1 className='text-xl text-zinc-800  dark:text-white font-bold'>Nearby reports</h1>
            <GoogleMapReportComp  locations={locations} markerDetails={markerDetails}/>
        </div>
    </>
  )
}

export default ReportMap