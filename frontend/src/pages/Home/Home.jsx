import { HomeHeroImg } from '@/assets/assets.config'
import HomePostCard from '@/components/ui/Post/HomePostCard'
import React from 'react'
import { NavLink } from 'react-router'

function Home() {
  return (
    <>
      {/* backeground image  */}
      <img src={HomeHeroImg} alt="" className='w-full opacity-40 h-[90vh] absolute overflow-hidden object-cover'/>
      <div className='w-full h-[90vh] relative flex items-center flex-col'>
        <div className='w-full mt-4 p-4 h-[calc(100%-70%)] flex justify-center items-center'>
          <HomePostCard/>
        </div>
        <div className='w-full h-[calc(100%-30%)] flex flex-col gap-6 items-center justify-center'>
          <NavLink to={'/explore-posts'} className='px-6 py-2 bg-blue-800 text-white font-outfit text-2xl rounded-xl'>Explore</NavLink>
          <NavLink to={'/new-post'} className='px-6 py-2 border hover:bg-blue-800 hover:text-white duration-100 text-blue-600 backdrop-blur-lg font-outfit text-2xl rounded-xl'>Report An Issue</NavLink>
        </div>
      </div>
    </>
  )
}

export default Home