import { useSearchFilterContext } from "@/utils/Context/SearchFilterContext";
import { useSelect } from "@chakra-ui/react";
import {
  RiCheckboxCircleFill,
  RiCircleFill,
  RiCloseLine,
  RiCrossLine,
  RiErrorWarningLine,
  RiProgress2Line,
  RiProgress4Line,
} from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

// status, setStatus, showFilter,filterData, setFilterData, setShowFilter , trigger
function Filter({showFilter, setShowFilter}) {

  const user = useSelector(state => state.authSlice.user)
  const location = useLocation()
  const {statusFilters, categories, approvalOptions, filterData, handleFilterDataInput, ResetFilterData, triggerApplyFilter} = useSearchFilterContext()

  const handleApplyFilter = () => {
    setShowFilter(prev => !prev)
    triggerApplyFilter()
  }

  useEffect(() => {
      if (showFilter == true) {
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "visible";
      }
    }, [showFilter]);


  return (
    <>
      <div  className={`w-full fixed font-outfit inset-0 items-end bg-black opacity-100 bg-opacity-35 duration-400 transition-opacity ease-in-out bottom-0   bg-scroll h-screen z-[200] left-0 shadow-black flex ${showFilter ? "opacity-100 visible": "opacity-0 invisible"}`}>
          <div onClick={() => setShowFilter(false)} className={`${showFilter? "flex": "hidden"} top-0 absolute w-full h-[38%]`}></div>
          <div className={`${showFilter? "translate-y-0": "translate-y-[100%]"} flex flex-col gap-4 p-5 items-center absolute duration-300 w-full bg-white dark:bg-zinc-900 dark:border-t dark:border-zinc-700 ease-in-out ${location.pathname === "/user-posts"? "h-[75%]": "h-[62%]"} ${user && user?.role === "authority" &&  "h-[48%]"} `}>
            <RiCloseLine onClick={() => setShowFilter(false)} size={20} className="absolute text-zinc-500 top-0 right-0 m-5"/>
            
            <div className="w-full flex flex-col gap-2 items-center">
              <h3 className="text-xl font-bold">Filter Reports</h3>
              <h3 className="text-sm text-zinc-400">Narrow down reports based on your criteria</h3>
            </div>

            {/* status filter  */}
            {(!user || (user && user.role !== "admin")) && (
              <div className="w-full flex flex-col border-b border-zinc-300 pb-4 items-start gap-4 ">
                <h3 className="font-outfitSemiBold">Status</h3>
                <div className="w-full grid grid-cols-2  gap-2">
                  {statusFilters.map((item, key) => (
                    <div className="flex items-center gap-2" key={key}>
                      <input
                        type="radio"
                        value={item.value}
                        id={item.value}
                        checked={filterData.status.includes(item.value)}
                        onClick={() => handleFilterDataInput("status",item.value)}
                      />
                      <label htmlFor={item.value} className="flex items-center">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approval filter options  */}
            {user && (user.role === "admin" || location.pathname === "/user-posts") && (
              <div className="w-full flex flex-col border-b border-zinc-300 pb-4 items-start gap-4 ">
              <h3 className="font-outfitSemiBold">Approval Status</h3>
              <div className="w-full grid grid-cols-2  gap-2">
                {approvalOptions.map((item, key) => (
                  <div className="flex items-center gap-2" key={key}>
                    <input
                      type="radio"
                      value={item.value}
                      id={item.value}
                      checked={filterData.approvalStatus.includes(item.value)}
                      onClick={() => handleFilterDataInput("approvalStatus",item.value)}
                    />
                    <label htmlFor={item.value} className="flex items-center">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            )}


            {/* Categories section  */}
            {user && user.role !== "authority" && (
              <div className="w-full flex flex-col border-b border-zinc-300 pb-4 items-start gap-4 ">
                <h3 className="font-outfitSemiBold">Category</h3>
                <select value={filterData.category} onChange={(e) => handleFilterDataInput("category",e.target.value)} name="category" className="w-full p-2  border border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-500 ">
                    {categories.map((item, key) => (
                      <option  key={key} value={item.id}>{item.name}</option>
                    ))}
                </select>
              </div>
            )}  

            {/* Distance  */}
            <div className="w-full flex flex-col  pb-4 items-start gap-4 ">
              <h3 className="font-outfitSemiBold">Distance</h3>
              <div className="w-full flex flex-col gap-2">
                <input value={filterData.distance} onChange={(e) => handleFilterDataInput("distance",e.target.value)} className="w-full" type="range"  name="distance" min={1} max={30} id="" />
                <div className="w-full text-xs flex items-center justify-between">
                  <h1>1 Km</h1>
                  <h1>30 Km</h1>
                </div>
              </div>
            </div>

            {/* Buttons  */}
            <div className="w-full flex justify-center gap-2 pb-4">
              <button onClick={ResetFilterData} className={`flex items-center w-1/2 justify-center gap-1 py-2 px-5 bg-white dark:bg-zinc-700 dark:hover:bg-white dark:hover:text-zinc-800 dark:text-white text-zinc-800 border border-zinc-500 hover:bg-zinc-800 hover:text-white duration-300  rounded-lg`}>Reset All</button>
              <button onClick={handleApplyFilter} className={`flex items-center justify-center w-1/2 py-2 px-5 dark:bg-white dark:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-white bg-zinc-800 hover:bg-white hover:border-zinc-500 hover:border hover:text-zinc-800 text-white duration-300 rounded-lg`}>Apply filters</button>
            </div>
          </div>
      </div>
    </>
  );
}

export default Filter;


{/* <div
      className={`w-[calc(93%)] rounded-md transition-all z-10 duration-200 shadow-lg p-5 bg-white absolute font-outfit dark:bg-zinc-800 top-14 flex-col gap-3 justify-center ${
        showFilter ? "flex" : "opacity-0 flex"
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
    </div> */}
