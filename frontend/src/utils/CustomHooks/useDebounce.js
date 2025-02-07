// By implementing debouncing, you ensure that the application waits for a pause in the user’s activity before making the API call. This significantly reduces the number of calls and allows the application to perform more efficiently. The user perceives the application as faster and more responsive.

import { useState, useEffect, useRef } from 'react';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeoutRef = useRef(null);

    const cancel = () => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        }, delay);

        return () => {
        cancel();
        };
    }, [value, delay]);

    return [debouncedValue, cancel];
};

export default useDebounce;