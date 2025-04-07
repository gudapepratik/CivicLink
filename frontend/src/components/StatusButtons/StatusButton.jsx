import React, { useEffect, useState } from "react";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiLoaderLine,
  RiProgress2Line,
  RiProgress4Line,
  RiProhibitedLine,
} from "@remixicon/react";

function StatusButton({ status, isApproved, rejectedBy, approvedBy }) {
  const [statusButtonType, setStatusButtonType] = useState(status)
  
    useEffect(() => {
    if(!isApproved && !approvedBy && !rejectedBy) {
      setStatusButtonType("awaiting")
    } else if(!isApproved && rejectedBy){
      setStatusButtonType("dismissed")
    } 
    },[])

  return (
    <>
      {statusButtonType === "pending" && (
        <div className="flex gap-2 text-yellow-500 dark:bg-zinc-800 font-poppins text-xs items-center border bg-yellow-50 border-yellow-500 dark:border-none p-1 rounded-md">
          <RiProgress2Line size={15} />
          <h2>Pending</h2>
        </div>
      )}
      {statusButtonType === "awaiting" && (
        <div className="flex gap-2 text-orange-600 dark:bg-orange-800 dark:bg-opacity-25 font-poppins text-xs items-center border bg-orange-50 border-orange-600 dark:border-none p-1 rounded-md">
          <RiLoaderLine size={15} className="animate-spin duration-1000"/>
          <h2>Awaiting Approval</h2>
        </div>
      )}
      {statusButtonType === "dismissed" && (
        <div className="flex gap-2 text-rose-600 dark:bg-rose-800 dark:bg-opacity-25 font-poppins text-xs items-center border bg-rose-50 border-rose-600 dark:border-none p-1 rounded-md">
          <RiProhibitedLine size={15} />
          <h2>Dismissed</h2>
        </div>
      )}
      {statusButtonType === "inprogress" && (
        <div className="flex gap-2 text-orange-500 dark:bg-zinc-800 font-poppins text-xs items-center border bg-orange-50 border-orange-500 dark:border-none p-1 rounded-md">
          <RiProgress4Line size={15} />
          <h2>In Progress</h2>
        </div>
      )}
      {statusButtonType === "resolved" && (
        <div className="flex gap-2 text-green-500 dark:bg-zinc-800 font-poppins text-xs items-center border bg-green-50 border-green-500 dark:border-none p-1 rounded-md">
          <RiCheckboxCircleLine size={15} />
          <h2>Resolved</h2>
        </div>
      )}
      {statusButtonType === "rejected" && (
        <div className="flex gap-2 text-red-600 dark:bg-zinc-800 font-poppins text-xs items-center border bg-red-50 border-red-600 dark:border-none p-1 rounded-md">
          <RiErrorWarningLine size={15} />
          <h2>Rejected</h2>
        </div>
      )}
    </>
  );
}

export default StatusButton;
