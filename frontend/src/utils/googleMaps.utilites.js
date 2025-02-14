import axios from "axios";
import config from "../../config/config";
import ErrorHandler from "./ErrorHandler.utils";
import httpClient from "@/api/httpClient";
import { API_ENDPOINTS } from "@/api/apiConstants";

export const getAddressFromCoordinates = async ({lat, lng}) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.googleMapsApiKey}`)
        // console.log(response)
        if (response.data.status === "OK") {
            const address = response.data.results[0].formatted_address
            return address;
        } else {
            return null;
        }
    } catch (error) {
        ErrorHandler(error)
    }
};


export const getCoordinatesFromAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.googleMapsApiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { lat, lng };
        } else {
            console.error("Geocoding failed:", response.data.status);
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        return null;
    }
};

export const fetchSuggestions = async ({ input, setSuggestions }) => {
    try {
        console.log(input)
        const response = await httpClient.get(`${API_ENDPOINTS.POST}/get-search-suggestions`,{
            params: {
                input: encodeURIComponent(input)
            }
        });
        if (response.data.status === "OK") {
            setSuggestions(response.data.predictions.map((p) => p.description));
        } else {
            setSuggestions([]);
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
};