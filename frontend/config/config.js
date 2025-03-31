import { meta } from "@eslint/js"

const config = {
    backendApiBaseUrl: String(import.meta.env.VITE_APP_API_BASE_URL),
    googleMapsApiKey: String(import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY),
    googleMapsClusterMapId: String(import.meta.env.VITE_APP_GOOGLE_MAPS_CLUSTER_MAP_ID),
    googleMapsGeocodingApiKey: String(import.meta.env.VITE_APP_GOOGLE_GEOCODING_API_KEY)
}

export default config