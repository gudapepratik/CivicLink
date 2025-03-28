import {
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiProgress2Line,
  RiProgress4Line,
} from "@remixicon/react";
import React from "react";

function Filter({status, setStatus, showFilter, setShowFilter , trigger}) {
  const statusFilters = [
    {
      label: (
        <>
          <RiProgress2Line size={18} className="text-yellow-400" /> pending
        </>
      ),
      value: "pending",
    },
    {
      label: (
        <>
          <RiProgress4Line size={18} className="text-yellow-400" /> In progress
        </>
      ),
      value: "inprogress",
    },
    {
      label: (
        <>
          <RiCheckboxCircleFill size={18} className="text-green-500" /> Resolved
        </>
      ),
      value: "resolved",
    },
    {
      label: (
        <>
          <RiErrorWarningLine size={18} className="text-red-500" /> Rejected
        </>
      ),
      value: "rejected",
    },
  ];
  return (
    <div
      className={`w-[calc(93%)] rounded-md transition-all z-10 duration-700 shadow-lg p-5 bg-white absolute font-outfit dark:bg-zinc-800 top-14 flex-col gap-3 justify-center ${
        showFilter ? "flex" : "hidden"
      }`}
    >
      <h3 className="text-lg font-bold ">Filter Reports</h3>

      <div>
        <h3>Status</h3>

        <div className="flex flex-col gap-2">
          {statusFilters.map((item, key) => (
            <div className="flex items-center gap-2" key={key}>
              <input
                type="radio"
                value={item.value}
                name="status"
                id={item.value}
                checked={item.value === status ? true: false}
                onChange={() => setStatus(item.value)}
              />
              <label htmlFor={item.value} className="flex items-center">
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-end ">
        <div className="flex items-center gap-4">
            <button onClick={() => setShowFilter(prev => !prev)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition">
            Cancel
            </button>
            <button onClick={() => {
                trigger(prev => !prev)
                setShowFilter(false)
            }} className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            Submit
            </button>
        </div>
    </div>
    </div>
  );
}

export default Filter;
