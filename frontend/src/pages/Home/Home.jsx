import { HeroImg2, HomeCardimg2, HomeHeroImg } from "@/assets/assets.config";
import HomeCard from "@/components/HomeCard/HomeCard";
import HomePostCard from "@/components/Post/HomePostCard";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import { RiArrowRightLine, RiArrowRightSLine, RiErrorWarningLine } from "@remixicon/react";
import React, { useEffect } from "react";
import { NavLink } from "react-router";

function Home() {

  const HomeCardData = [
    {
      icon: "report",
      title: "Report Issues",
      description: "Quickly report potholes, graffiti, broken streetlights, and other community issues."
    },
    {
      icon: "track",
      title: "Track Progress",
      description: "Follow the status of reported issues and see when they're resolved by local authorities."
    },
    {
      icon: "community",
      title: "Community Discussion",
      description: "Engage with neighbors about local issues and collaborate on community initiatives."
    }
  ]
  
  return (
    <>
      <div className="w-full font-outfit bg-zinc-50">
        <div className="w-full p-8  border-b relative z-10 pb-20  border-zinc-300 flex flex-col justify-center  items-center gap-3">
          <h1 className="text-3xl  font-outfitBold text-center text-zinc-800">Connect with your community</h1>
          <h1 className="text-base text-center text-zinc-400">Report local issues, explore community posts, and make your neighborhood better together.</h1>
          
          <div className="flex gap-2 flex-col">
            <NavLink to={"/explore-posts"} className={`flex items-center py-3 px-5 bg-zinc-800 hover:bg-white hover:border-zinc-500 hover:border hover:text-zinc-800 text-white duration-300 rounded-lg`}>
              <span className="font-medium">Explore posts</span>
              <RiArrowRightSLine/>
            </NavLink>

            <NavLink to={"/new-post"} className={`flex items-center gap-1 py-3 px-5 bg-white text-zinc-800 border border-zinc-500 hover:bg-zinc-800 hover:text-white duration-300  rounded-lg`}>
              <RiErrorWarningLine size={20}/>
              <span className="font-medium">Make a Report</span>
            </NavLink>
          </div>
        </div>

        <div className="flex flex-col p-5 gap-2 items-center">
          {HomeCardData.map((item,index) => (
            <HomeCard key={index} title={item.title} icon={item.icon} description={item.description}/>
          ))}
        </div>


        <div className="w-full p-6 h-fit border-b bg-white relative z-10  border-zinc-300 flex flex-col items-center gap-3">
          <h1 className="text-3xl  font-outfitBold text-center text-zinc-800">Join thousands of active citizens</h1>
          <h1 className="text-base  text-center text-zinc-400">CivikLink is helping communities across the country become safer, cleaner, and more connected.</h1>
          
          <div className="w-full flex flex-col justify-center gap-2 bg-white ">
            <NavLink to={'/login'} className={`flex items-center justify-center py-2 px-5 bg-zinc-800 hover:bg-white hover:border-zinc-500 hover:border hover:text-zinc-800 text-white duration-300 rounded-lg`}>
              <span className="font-medium">Sign Up</span>
              <RiArrowRightSLine/>
            </NavLink>
          </div>
        </div>

        <div className="w-full p-6 h-fit border-b bg-white relative z-10  border-zinc-800 flex flex-col justify-center  items-center gap-5">
          <p className="text-sm text-zinc-500">© 2024 CivikLink. All rights reserved.</p>
          <div className="w-[50%] flex items-center justify-between text-sm underline-offset-2 underline text-zinc-500">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;


//  {/* backeground image  */}
//  <img
//  src={HomeHeroImg}
//  alt=""
//  className="w-full opacity-40 h-[90vh] absolute overflow-hidden object-cover"
// />
// <div className="w-full h-[90vh] relative flex items-center flex-col">
//  <div className="w-full mt-4 p-4 h-[calc(100%-70%)] flex justify-center items-center">
//    <HomePostCard />
//  </div>
//  <div className="w-full h-[calc(100%-30%)] flex flex-col gap-6 items-center justify-center">
//    <NavLink
//      to={"/explore-posts"}
//      className="px-6 py-2 bg-blue-800 text-white font-outfit text-2xl rounded-xl"
//    >
//      Explore
//    </NavLink>
//    <NavLink
//      to={"/new-post"}
//      className="px-6 py-2 border hover:bg-blue-800 hover:text-white duration-100 text-blue-600 backdrop-blur-lg font-outfit text-2xl rounded-xl"
//    >
//      Report An Issue
//    </NavLink>
//  </div>
// </div>