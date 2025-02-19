import React from 'react'
import MoonLoader from 'react-spinners/MoonLoader'

function Loader() {
  return (
    <>
        <div className="w-full h-screen fixed bg-transparent bg-opacity-5 backdrop-blur-sm flex z-[100] top-0 left-0 items-center justify-center">
          <MoonLoader
            color="#0754f6"
            cssOverride={{}}
            loading
            size={60}
            speedMultiplier={0.9}
          />
        </div>
    </>
  )
}

export default Loader