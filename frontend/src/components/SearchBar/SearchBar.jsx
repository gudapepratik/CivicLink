import { useLocationContext } from "@/utils/Context/LocationContext";
import { fetchSuggestions, getAddressFromCoordinates, getCoordinatesFromAddress } from "@/utils/googleMaps.utilites";
import { RiFilter2Line, RiFilter3Line, RiFilterFill, RiFilterLine, RiSearchLine } from "@remixicon/react";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Filter from "../Filter/Filter";

function SearchBar({status, setStatus, trigger}) {
  console.log(status)
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestions] = useState([]);
  const {location, setLocation} = useLocationContext()
  const [showFilter, setShowFilter] = useState(false)

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
      console.log(error)
    }
  }


  return (
    <div className="w-full relative font-outfit  bg-white dark:bg-zinc-800 rounded-lg flex items-center gap-3 border p-3">
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
      
      
      <Filter status={status} setStatus={setStatus} showFilter={showFilter} trigger={trigger} setShowFilter={setShowFilter}/>
    </div>
  );
}

export default SearchBar;
