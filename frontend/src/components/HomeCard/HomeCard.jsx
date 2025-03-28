import { RiAlignLeft, RiDiscussLine, RiMapLine } from "@remixicon/react";
import React from "react";

function HomeCard({title, icon, description}) {
  return (
    <div className="rounded-lg border bg-white hover:shadow-sm  p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
      {icon === "report" && <RiMapLine/>}
      {icon === "track" && <RiAlignLeft/>}
      {icon === "community" && <RiDiscussLine/>}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  );
}

export default HomeCard;
