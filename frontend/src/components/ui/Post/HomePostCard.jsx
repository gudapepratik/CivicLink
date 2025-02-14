import { HomeCardimg1, HomeCardimg2 } from '@/assets/assets.config'
import React from 'react'

function HomePostCard() {
  return (
    <div className='w-full h-full bg-white font-outfit rounded-3xl relative overflow-hidden shadow-lg p-8'>
        <img src={HomeCardimg2} alt="" className='object-fill absolute  inset-0 w-full h-full'/>
        <h1 className='relative z-10 text-blue-500 font-extrabold text-2xl'>Facing a problem in your locality?</h1>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <h1 className='relative z-10 text-white text-sm'>Report issues like water shortages, power cuts, or road damages in just a few clicks!</h1>
    </div>
  )
}

export default HomePostCard