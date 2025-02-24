import MetricsCard from "@/components/MetricsCard/MetricsCard";
import React from "react";

function Dashboard() {
  const metrics = [
    {
      title: "Total Reports",
      value: 120,
      description: "Cases reported by citizens.",
      color: "bg-zinc-400",
    },
    {
      title: "Resolved Issues",
      value: 80,
      description: "Successfully closed cases.",
      color: "bg-green-600",
    },
    {
      title: "Pending Cases",
      value: 30,
      description: "Awaiting action.",
      color: "bg-yellow-500",
    },
    {
      title: "Rejected Cases",
      value: 10,
      description: "Marked as invalid.",
      color: "bg-red-500",
    },
    {
      title: "Avg. Resolution Time",
      value: "2.5 days",
      description: "Time taken to resolve issues.",
      color: "bg-indigo-600",
    },
    {
      title: "High Priority Cases",
      value: 5,
      description: "Urgent cases that need attention.",
      color: "bg-purple-600",
    },
  ];

  return (
    <>
      <div className="w-full p-4 flex flex-col items-center">
        <div className="w-full flex flex-col gap-4">
            <MetricsCard itemDetails={metrics[0]} headingStyles={"text-zinc-900 font-bold font-outfit text-xl"} valueStyles={"text-zinc-900 font-bold text-4xl"} descStyles={"font-outfit text-sm text-zinc-800 font-semibold"}/>
            <div className="w-full grid grid-cols-2 gap-2">
                <MetricsCard itemDetails={metrics[1]} headingStyles={"text-zinc-900 font-bold font-outfit "} valueStyles={"text-green-950 font-bold text-4xl"} descStyles={"font-outfit text-sm text-zinc-800 font-semibold"}/>
                <MetricsCard itemDetails={metrics[2]} headingStyles={"text-zinc-900 font-bold font-outfit"} valueStyles={"text-zinc-900 font-bold text-4xl"} descStyles={"font-outfit text-sm text-zinc-800 font-semibold"}/>
            </div>
            
         
        </div>
      </div>
    </>
  );
}

export default Dashboard;
