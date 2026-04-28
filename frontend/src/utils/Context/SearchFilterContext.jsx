import { RiCircleFill } from "@remixicon/react";
import { createContext, useContext, useState } from "react";

const SearchFIilterContext = createContext();

const statusFilters = [
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-yellow-400" /> <p>Pending</p></div>
        </>
      ),
      value: "pending",
    },
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-orange-500" /> <p>In progress</p></div>
        </>
      ),
      value: "inprogress",
    },
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-green-500" /> <p>Resolved</p></div>
        </>
      ),
      value: "resolved",
    },
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-red-600" /> <p>Rejected</p></div>
        </>
      ),
      value: "rejected",
    },
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "roads", name: "Roads & Sidewalks" },
    { id: "lighting", name: "Street Lighting" },
    { id: "sanitation", name: "Sanitation & Waste" },
    { id: "vandalism", name: "Vandalism & Graffiti" },
    { id: "parks", name: "Parks & Recreation" },
    { id: "water", name: "Water & Sewage" },
    { id: "other", name: "Other Issues" },
  ]

  const approvalOptions = [
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-orange-400" /> <p>Awaiting</p></div>
        </>
      ),
      value: "awaiting",
    },
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-red-600" /> <p>Dismissed</p></div>
        </>
      ),
      value: "dismissed",
    },
    {
      label: (
        <>
          <div className="flex gap-2 items-center "><RiCircleFill size={12} className="text-green-500" /> <p>Approved</p></div>
        </>
      ),
      value: "approved",
    },
  ]

  const sortOptions = [
    {
      label: "Most Recent",
      value: "recent"
    },
    {
      label: "Oldest first",
      value: "oldestfirst"
    },
    {
      label: "Most Upvoted",
      value: "mostupvoted"
    },
    {
      label: "Most Commented",
      value: "mostcommented"
    },
    {
      label: "Nearest first",
      value: "nearestfirst"
    },
  ]

export const SearchFilterProvider = ({ children }) => {

  const [filterTrigger, setFilterTrigger] = useState(false);

  const [filterData, setFilterData] = useState({
    status: ["all"],
    category: "all",
    distance: 10, // 10 km default
    sortBy: "nearestfirst",
    approvalStatus: ["approved"],
  });

  const ResetFilterData = () => {
    setFilterData((prev) => ({
      ...prev,
      status: ["all"],
      category: "all",
      distance: 10,
      approvalStatus: ["approved"]
    }));
  };

  const triggerApplyFilter = () => {
    setFilterTrigger(prev => !prev)
  }

  const handleFilterDataInput = (key, value) => {
    if(key === "status") {
      if (filterData.status.includes(value)) {
        // Remove the value
        const newStatus = filterData.status.filter(item => item !== value);
        setFilterData(prev => ({...prev,status: newStatus.length === 0 ? ["all"] : newStatus}));
      } else {
        // Remove "all" if present and add the new value
        const newStatus = filterData.status.filter(item => item !== "all");
        setFilterData(prev => ({...prev, status: [...newStatus, value]}));
      }
    }

    if(key === "approvalStatus") {
      if (filterData.approvalStatus.includes(value)) {
        // Remove the value
        const newStatus = filterData.approvalStatus.filter(item => item !== value)
        setFilterData(prev => ({...prev,approvalStatus: newStatus.length === 0 ? ["approved"] : newStatus}));
      } else {
        // Remove "all" if present and add the new value
        const newStatus = filterData.approvalStatus.filter(item => item !== "approved");
        setFilterData(prev => ({...prev, approvalStatus: [...newStatus, value]}));
      }
    }

    if(key === "category") {
      // just replace with the new one 
      setFilterData(prev => ({...prev, category: value}))
    }
    
    if(key === "distance") {
      // just replace with the new one
      setFilterData(prev => ({...prev, distance: value}))
    }
  }

  const [viewType, setViewType] = useState("list"); // list / map

  return (
    <SearchFIilterContext.Provider value={{filterData,setFilterData,filterTrigger, handleFilterDataInput, setViewType, viewType, triggerApplyFilter, sortOptions, statusFilters, categories, approvalOptions, ResetFilterData}}>
      {children}
    </SearchFIilterContext.Provider>
  );
};
export const useSearchFilterContext = () => useContext(SearchFIilterContext);
