import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from '@/config/env';

// API configuration
const API_BASE_URL = config.api.baseUrl;

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes (120 seconds) for all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors here
    const status = error.response?.status;
    if (status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (status === 404) {
      // Handle not found
      console.error('Resource not found');
    } else if (status && status >= 500) {
      // Handle server errors
      console.error('Server error occurred');
    }
    
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Request timeout:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 