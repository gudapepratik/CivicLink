import axios from 'axios';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom'; // For redirection
import { API_ENDPOINTS } from './apiConstants';

// Create an Axios instance
const httpClient = axios.create({
    baseURL: config.backendApiBaseUrl || 'http://localhost:8000',
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to track token refresh status
let isRefreshing = false;
let failedQueue = [];

// Helper to process queued requests after refreshing the token
const processQueue = (error, token = null) => {
    failedQueue.forEach(promise => {
        if (token) {
        promise.resolve(token);
        } else {
        promise.reject(error);
        }
    });
    failedQueue = [];
};

// Add response interceptor
httpClient.interceptors.response.use(
    (response) => {
        // Return response directly if successful
        return response;
    },
    async (error) => {
        // console.log(error)
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and the request has not been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // If already refreshing the token, queue the failed request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
            })
            .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return axios(originalRequest);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
            // Call the refresh token endpoint
            const refreshResponse = await axios.post(`${config.backendApiBaseUrl}${API_ENDPOINTS.AUTH}/refresh-token`,{}, {
                withCredentials: true,
            });

            // Extract the new access token
            const newAccessToken = refreshResponse.data.accessToken;

            // Update the Authorization header for the original request
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            // console.log(newAccessToken, refreshResponse)

            // Process all queued requests
            processQueue(null, newAccessToken);

            // Retry the original request with the new token
            return httpClient(originalRequest);
        } catch (refreshError) {
            // console.log(refreshError)
            // If refresh token is also invalid or expired, redirect to login
            processQueue(refreshError, null);
            // window.location.href = '/login'
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
        }

        // If it's not a 401 or retry fails, reject the error
        return Promise.reject(error);
    }
);

export default httpClient;
