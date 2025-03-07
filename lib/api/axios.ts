import axios from 'axios';
import { getStoredToken } from '../utils';

// Updated BASE_URL to match your .env configuration with no /api suffix
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444';

 // Debug log

// Create a configured axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Debug log for requests
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    });
    
    // Add CORS headers
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Debug log for successful responses
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    // Detailed error logging
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message,
      stack: error.stack
    });

    if (error.response?.status === 401) {
      // Remove token and trigger logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Log detailed error information
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;