import axios from "axios";
import config from "../../config/config";
import ErrorHandler from "./ErrorHandler.utils";
import httpClient from "@/api/httpClient";
import { API_ENDPOINTS } from "@/api/apiConstants";

// export const getAddressFromCoordinates = async ({lat, lng}) => {
//     try {
//         const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.googleMapsGeocodingApiKey}`)
//         // console.log(response)
//         if (response.data.status === "OK") {
//             const address = response.data.results[0].formatted_address
//             return address;
//         } else {
//             return null;
//         }
//     } catch (error) {
//         ErrorHandler(error)
//     }
// };
export const getAddressFromCoordinates = async ({ lat, lng }) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat,
          lon: lng, // Nominatim uses "lon" instead of "lng"
        },
        headers: {
          "Accept-Language": "en", // optional: force English results
        },
      }
    );

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    } else {
      return null;
    }
  } catch (error) {
    ErrorHandler(error);
    return null;
  }
};

// export const getCoordinatesFromAddress = async (address) => {
//     // console.log(address)
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.googleMapsGeocodingApiKey}`;

//     try {
//         const response = await axios.get(url);
//         // console.log(response)
//         if (response.data.status === "OK") {
//             const { lat, lng } = response.data.results[0].geometry.location;
//             return { lat, lng };
//         } else {
//             console.error("Geocoding failed:", response);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching coordinates:", error);
//         return null;
//     }
// };
export const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      console.error("Geocoding failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export const fetchSuggestions = async ({ input, setSuggestions }) => {
    try {
        const response = await httpClient.get(`${API_ENDPOINTS.POST}/get-search-suggestions`,{
            params: {
                input: encodeURIComponent(input)
            }
        });
        if (response.data?.length > 0) {
            setSuggestions(response.data.map((p) => p.display_name));
        } else {
            setSuggestions([]);
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
};
