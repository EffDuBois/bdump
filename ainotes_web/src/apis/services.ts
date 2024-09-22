import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || "http://localhost:8000",
});

export default baseAPI;
