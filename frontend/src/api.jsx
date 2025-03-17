import axios from 'axios';

const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5000"; // Get the frontend URL from environment variables or default to localhost
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000" // Get the backend URL from environment variables or default to localhost
const apiUrl = `${backendUrl}`; 

const API = axios.create({
  baseURL: apiUrl, // Set the base URL for the API
  withCredentials: true, // Allow cookies for authentication
});

export default API;
