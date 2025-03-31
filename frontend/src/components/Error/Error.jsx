// import { NotLoginImg1 } from "@/assets/assets.config";
import React from "react";

function Error({image, title, message, hoffset}) {
  return (
    <div className={`flex relative flex-col items-center justify-center max-w-full `} style={{ height: `calc(100vh - ${hoffset}px)` }}>
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
    </div>
  );
}

export default Error;
