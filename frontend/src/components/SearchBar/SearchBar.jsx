import { useLocationContext } from "@/utils/Context/LocationContext";
import { fetchSuggestions, getAddressFromCoordinates, getCoordinatesFromAddress } from "@/utils/googleMaps.utilites";
import { RiSearchLine } from "@remixicon/react";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

function SearchBar({setCoordinates}) {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestions] = useState([]);
  const {location, setLocation} = useLocationContext()

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
    <div className="w-full relative font-outfit bg-white flex items-center gap-3 border p-3">
      <label htmlFor="search">Search:</label>
      <form onSubmit={handleSearchSubmit} className="flex  items-center w-full border rounded-lg bg-zinc-50">
        <div className="w-full">
          <input
            type="text"
            id="searh"
            value={query}
            list="search"
            autoComplete="billing street-address"
            className="bg-zinc-50 focus:outline-none p-2"
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
        className="w-12 bg-zinc-100 p-2 flex items-center justify-center rounded-r-lg"
        type="submit"
        >
          <RiSearchLine className=""/>
        </button>

      </form>
    </div>
  );
}

export default SearchBar;
