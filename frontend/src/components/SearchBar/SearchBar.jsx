import { useLocationContext } from "@/utils/Context/LocationContext";
import { fetchSuggestions, getAddressFromCoordinates, getCoordinatesFromAddress } from "@/utils/googleMaps.utilites";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";

function SearchBar({setCoordinates}) {
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestions] = useState([]);
  const {location, setLocation} = useLocationContext()

  const handleSearchInput = async (e) => {
    setQuery(e.target.value);
    console.log(query)

    const coordinates = await getCoordinatesFromAddress(query)
    // console.log(coordinates)
    setLocation([coordinates.lat,coordinates.lng])

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
    const response = await getAddressFromCoordinates({lat: location[0], lng: location[1]})
    setQuery(response)  
  } 
  useEffect(() => {
    fetchDefaultQuery();
  },[])


  return (
    <div className="w-full relative font-outfit bg-white flex items-center gap-3 border p-3">
      <label htmlFor="search">Search:</label>
      <div className="w-full">
        <input
          type="text"
          id="searh"
          value={query}
          list="search"
          autoComplete="billing street-address"
          className="p-2 w-full border rounded-lg bg-zinc-50 focus:outline-[1px] focus:outline-zinc-400"
          placeholder="Enter a location"
          onChange={(e) => handleSearchInput(e)}
        />
        <datalist id="search" className="relative">
          {suggestion.map((value, key) => (
            <option className="" key={key} value={value}></option>
          ))}
        </datalist>
      </div>
    </div>
  );
}

export default SearchBar;
