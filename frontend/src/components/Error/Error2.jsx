// import { NotLoginImg1 } from "@/assets/assets.config";
import { RiArrowRightSLine } from "@remixicon/react";
import React from "react";
import { NavLink } from "react-router";

function Error2({image, title, message, hoffset}) {
  return (
    <div className={`flex relative flex-col items-center justify-center max-w-full `} style={{ height: `calc(100vh - ${hoffset}px)` }}>
        <div className="w-full flex flex-col items-center gap-3">
          <div className="w-full flex flex-col items-center">
              <img src={image} alt="empty bag image" className="size-40 mb-4" />
              <h1 className=" font-outfit font-bold text-xl text-blue-950 text-center">
                  {/* User Not logged in */}
                  {title}
              </h1>
              <h1 className="font-outfit font-normal text-zinc-400 text-center">
                  {/* Log in to your account to Create a post */}
                  {message}
              </h1>
          </div>
            <NavLink to={'/login'} className={`flex items-center  dark:bg-zinc-800 dark:text-white justify-center py-2 px-5 bg-zinc-800 hover:bg-white hover:border-zinc-500 hover:border hover:text-zinc-800 text-white duration-300 rounded-lg`}>
              <span className="font-medium">Login Now</span>
              <RiArrowRightSLine/>
            </NavLink>
        </div>
    </div>
  );
} 

export default Error2;
