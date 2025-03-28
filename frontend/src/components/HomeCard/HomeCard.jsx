import { HomeCardimg1, HomeCardimg2, HomeCardimg3 } from "@/assets/assets.config";
import { RiAlignLeft, RiDiscussLine, RiMapLine } from "@remixicon/react";
import React from "react";

function HomeCard({title, icon, description}) {
  return (
    <div className="rounded-lg border relative dark:bg-zinc-800 overflow-hidden bg-white dark:text-white dark:border-zinc-600 hover:shadow-sm  p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
      {icon === "report" && <RiMapLine/>}
      {icon === "track" && <RiAlignLeft/>}
      {icon === "community" && <RiDiscussLine/>}
      </div>

      {icon === "report" && <img src={HomeCardimg2} alt="" className="absolute -top-10 h-40 w-40 -z-8 -right-9"/>}
      {icon === "track" && <img src={HomeCardimg3} alt="" className="absolute -top-10 h-40 w-40 -z-8 -right-9"/>}
      {icon === "community" && <img src={HomeCardimg1} alt="" className="absolute -top-10 h-40 w-40 -z-8 -right-9"/>}
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  );
}

export default HomeCard;
