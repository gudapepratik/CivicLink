import { useLocationContext } from "@/utils/Context/LocationContext";
import { fetchSuggestions, getAddressFromCoordinates, getCoordinatesFromAddress } from "@/utils/googleMaps.utilites";
import { RiFilter2Line, RiFilter3Line, RiFilterFill, RiFilterLine, RiListUnordered, RiMap2Line, RiSearchLine, RiSoundModuleFill } from "@remixicon/react";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Filter from "../Filter/Filter";
import { useSearchFilterContext } from "@/utils/Context/SearchFilterContext";

// status,viewType, setViewType, setStatus,filterData, setFilterData, trigger
function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestions] = useState([]);
  const {location, setLocation} = useLocationContext()
  const [showFilter, setShowFilter] = useState(false)
  const [showSortOptions, setShowSortOptions] = useState(false)
  
  const {sortOptions, setFilterData, setViewType, triggerApplyFilter, viewType} = useSearchFilterContext()

  const handleSearchInput = async (e) => {
    setQuery(e.target.value)

    if (e.target.value.length > 3) {
      handleSearchApiCall(e.target.value, setSuggestions);
    }
  };

  const handleSearchApiCall = useCallback(
    debounce(async (input, setSuggestions) => {
      await fetchSuggestions({ input: input, setSuggestions: setSuggestions });
    }, 1000),
    []
  );

  // get the address for the location stored in location context and set it as a default query on load (component mount)
  const fetchDefaultQuery = async () => {
    const response = await getAddressFromCoordinates({lat: location.lat, lng: location.lng})
    setQuery(response)  
  } 

  useEffect(() => {
    fetchDefaultQuery();
  },[])

  const handleSearchSubmit = async (e) => {
    try {
      e.preventDefault()

      const coordinates = await getCoordinatesFromAddress(query)
      
      setLocation({
        lat: coordinates.lat,
        lng: coordinates.lng
      })
    } catch (error) {
      // console.log(error)
    }
  }

  const handleSortInput = (value) => {
    // console.log(value)  
    setShowSortOptions(false)
    setFilterData(prev => ({...prev, sortBy: value}))
    if(showSortOptions)
      triggerApplyFilter()
  }

  useEffect(() => {
    if (showSortOptions == true) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [showSortOptions]);


  return (
    <div className="w-full  font-outfit border  bg-white dark:bg-zinc-800 rounded-lg p-3 gap-2 flex flex-col">
      <div className="w-full  font-outfit  bg-white dark:bg-zinc-800 rounded-lg flex gap-2 items-center">
        <form onSubmit={handleSearchSubmit} className="flex items-center  w-full border dark:border-zinc-500 rounded-lg bg-zinc-50 dark:bg-zinc-700">
          <div className="w-full">
            <input
              type="text"
              id="searh"
              value={query}
              list="search"
              autoComplete="billing street-address"
              className="bg-zinc-50 dark:bg-zinc-700 rounded-l-lg focus:outline-none p-2"
              placeholder="Enter a location"
              onChange={(e) => handleSearchInput(e)}
            />
            <datalist id="search" className="relative">
              {suggestion.map((value, key) => (
                <option className="" key={key} value={value}></option>
              ))}
            </datalist>
          </div>
          <button 
          className="w-12 bg-zinc-100 dark:bg-zinc-700 p-2 flex items-center justify-center rounded-r-lg"
          type="submit"
          >
            <RiSearchLine className=""/>
          </button>
        </form>
  
        <div className="p-2 rounded-lg border" onClick={() => setShowFilter(prev => !prev)}>
          <RiFilter3Line size={23}/>
        </div>
  
        {/* <Filter status={status} setStatus={setStatus} filterData={filterData} setFilterData={setFilterData} showFilter={showFilter} trigger={trigger} setShowFilter={setShowFilter}/> */}
        <Filter showFilter={showFilter} setShowFilter={setShowFilter}/>
      </div>
      <div className="flex items-center gap-3">
        
        <button onClick={() => setShowSortOptions(true)} className="flex dark:border-zinc-700 py-2 px-5 border text-[14px] border-zinc-300 rounded-lg  w-fit  gap-2 items-center font-outfit">
          <RiSoundModuleFill size={17}/>
          <h2>Sort</h2>
        </button>

        {showSortOptions && (
          <div onClick={() => setShowSortOptions(false)} className="w-full fixed inset-0 bg-black bg-opacity-35 transition-opacity z-[200]  duration-300 ease-in-out"></div>
        )}
        
          <div className={`${showSortOptions ? "flex opacity-100 visible" : "opacity-0 invisible"} left-6 top-[23%]  text-zinc-800 z-[200] dark:border-zinc-700 rounded-lg shadow-md border bg-white dark:bg-zinc-800 dark:text-white duration-200 ease-out p-3  flex-col gap-2  absolute`}>
              <h2 className="pb-2 border-b">Sort by</h2>
              <div className="w-full">
                {sortOptions.map((item,index) => (
                  <p key={index} className="hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm p-1 w-full" onClick={() => handleSortInput(item.value)}>{item.label}</p>
                ))}
              </div>
          </div>
        
        
        
        <div className="flex border text-[14px] border-zinc-300 dark:border-zinc-700 rounded-lg   items-center font-outfit">
          <div onClick={() => setViewType("list")}  className={`${viewType === "list" ? "bg-zinc-800 dark:bg-white dark:text-zinc-800 text-white" : "bg-white dark:bg-zinc-500  text-zinc-800"} duration-300 py-2 px-3 rounded-l-lg`}>
            <RiListUnordered size={20}/>
          </div>
          <div onClick={() => setViewType("map")}  className={`${viewType === "map" ? "bg-zinc-800 dark:bg-white dark:text-zinc-800 text-white" : "bg-white dark:bg-zinc-500 text-zinc-800"} duration-300 py-2 px-3 rounded-r-lg`}>
            <RiMap2Line size={20}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
