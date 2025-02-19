import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js";
// import {triggerNotification} from '../../utils/triggerNotification.utils.js'
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class AuthService {
    // all the service functions here
    // method to handle login
    // data required - name(string), email(string), password(string), contactNumber(string), role(string)
    async registerUser({name, email, password, latitude, longitude, role, avatar, departmentId}) {
        try {
            if(
                [name, email, password, role].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }

            if(!avatar) throw new Error("Profile image is required")
                // console.log(departmentId)
            if(!latitude || !longitude) throw new Error("Location is required")
             // Create a new FormData instance
            
            const formData = new FormData();
    
            // Append fields to FormData
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('latitude', latitude);
            formData.append('longitude', longitude);
            formData.append('role', role);
            formData.append('avatar', avatar)
            if(departmentId) {
                formData.append('departmentId', departmentId)
            }
            
            // call the api
            const registerResponse = await httpClient.post(
                `${API_ENDPOINTS.AUTH}/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Explicitly set content type
                    },
                }
            )
    
            if(!registerResponse) throw new Error("Error while creating new user account !!?")
    
            return registerResponse;
        } catch (error) {
            ErrorHandler(error)
        }
    }

    async loginUser({email,password}) {
        try{
            // login the current user
            const reponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/login`, {email,password})
            
            // return the response // the tokens will be stored in cookies
            return reponse

        } catch(error) {
            ErrorHandler(error)
            // return error
        }
    }

    async logoutUser() {
        try{
            console.log("asf")
            const logoutResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/logout`)
            // const device = localStorage.getItem('deviceId')
            return logoutResponse
        }catch(error) {
            ErrorHandler(error)
        }
    }

    async getCurrentUser() {
        try{
            const userResponse = await httpClient.get(`${API_ENDPOINTS.AUTH}/get-current-user`)
            
            return userResponse.data.data
        }catch(error) {
            ErrorHandler(error)
        }
    }

    async updateUserDetails({name, email,age, avatar}) {
        try{
            if(
                [name, email].some(fields => fields === '') || !age
            ) {
                throw new Error("All fields are required !!")
            }
            console.log(name, email, age, avatar)

            const formData = new FormData();
    
            // Append fields to FormData
            formData.append('name', name);
            formData.append('email', email);
            formData.append('age', age);
            formData.append('avatar', avatar);

            const updatedDetailsResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/update-user-details`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            )
            
            return updatedDetailsResponse;
        }catch(error) {
            ErrorHandler(error)
        }
    }

    async updateUserPassword({oldPassword, newPassword}) {
        try{
            if(
                [oldPassword, newPassword].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }

            const updatedDetailsResponse = await httpClient.post(`${API_ENDPOINTS.AUTH}/update-user-password`, {
                oldPassword,
                newPassword
            })
            
            return updatedDetailsResponse;
        }catch(error) {
            ErrorHandler(error)
        }
    }



};

export default new AuthService();