import axios from 'axios';

const frontendUrl =
  import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5000';
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const apiUrl = `${backendUrl}`;

const API = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default API;
