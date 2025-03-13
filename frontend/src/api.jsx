import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // Backend API base URL
  withCredentials: true, // Allow cookies for authentication
});

export default API;
