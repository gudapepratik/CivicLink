import { HomeHeroImg } from '@/assets/assets.config'
import React from 'react'

function Home() {
  return (
    <>
      {/* backeground image  */}
      <img src={HomeHeroImg} alt="" className='w-full h-[90vh] overflow-hidden object-cover'/>
    </>
  )
}

export default Home