import { createContext, useContext, useState } from "react";

const LocationContext = createContext()

export const LocationProvider = ({children}) => {
    const defaultCoordinates = [18.521432806997094,73.85769665098046]
    const [location, setLocation] = useState(defaultCoordinates);

    return (
        <LocationContext.Provider value={{location, setLocation}}>
            {children}
        </LocationContext.Provider>
    )
}
export const useLocationContext = () => useContext(LocationContext)
