import axios from "axios";
import {API_ENDPOINTS} from '../apiConstants'
import httpClient from "../httpClient.js";
// import {triggerNotification} from '../../utils/triggerNotification.utils.js'
import ErrorHandler from "../../utils/ErrorHandler.utils.js";

export class adminService {
    async approveReport({ postId, recipient_email, recipient_name }) {
        try {
            if(
                [postId, recipient_email, recipient_name ].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }
            
            // call the api
            const approveResponse = await httpClient.post(
                `${API_ENDPOINTS.ADMIN}/approve-report`,
                {
                    postId,
                    recipient_email,
                    recipient_name
                }
            )
    
            if(!approveResponse) throw new Error("Error while Approving report !!?")
    
            return approveResponse;
        } catch (error) {
            ErrorHandler(error)
        }
    }


    async rejectReport({ postId, recipient_email, recipient_name, rejectionReason }) {
        try {
            if(
                [postId, recipient_email, recipient_name,rejectionReason ].some(fields => fields === '')
            ) {
                throw new Error("All fields are required !!")
            }
            
            // call the api
            const rejectionResponse = await httpClient.post(
                `${API_ENDPOINTS.ADMIN}/reject-report`,
                {
                    postId,
                    recipient_email,
                    recipient_name,
                    rejectionReason
                }
            )
    
            if(!rejectionResponse) throw new Error("Error while rejecting report !!?")
    
            return rejectionResponse;
        } catch (error) {
            ErrorHandler(error)
        }
    }
};

export default new adminService();