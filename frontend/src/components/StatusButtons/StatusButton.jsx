import React from "react";
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiProgress2Line,
  RiProgress4Line,
} from "@remixicon/react";

function StatusButton({ status }) {
  return (
    <>
      {status === "pending" && (
        <div className="flex gap-2 text-yellow-500 font-poppins text-xs items-center border bg-yellow-50 border-yellow-500 p-1 rounded-md">
          <RiProgress2Line size={15} />
          <h2>Pending</h2>
        </div>
      )}
      {status === "inprogress" && (
        <div className="flex gap-2 text-orange-500 font-poppins text-xs items-center border bg-orange-50 border-orange-500 p-1 rounded-md">
          <RiProgress4Line size={15} />
          <h2>In Progress</h2>
        </div>
      )}
      {status === "resolved" && (
        <div className="flex gap-2 text-green-500 font-poppins text-xs items-center border bg-green-50 border-green-500-500 p-1 rounded-md">
          <RiCheckboxCircleLine size={15} />
          <h2>Resolved</h2>
        </div>
      )}
      {status === "rejected" && (
        <div className="flex gap-2 text-red-600 font-poppins text-xs items-center border bg-red-50 border-red-600 p-1 rounded-md">
          <RiErrorWarningLine size={15} />
          <h2>Rejected</h2>
        </div>
      )}
    </>
  );
}

export default StatusButton;
