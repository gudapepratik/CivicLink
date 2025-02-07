import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    status: false,
    user: null,
    role: null // default value
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state,action) =>{
            state.status = true,
            state.user = action.payload // data of the current logged in user
            state.role = action.payload?.role
        },
        logout: (state,action) => {
            state.status = false,
            state.user = null
            state.role = null
        }
    }
})

// to import in componenets
export const {login,logout} = authSlice.actions

// to import in store
export default authSlice.reducer


