import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'

const store = configureStore({
    reducer: {
        authSlice,
        // productSlice,
        // cartSlice,
    },
});


export default store;