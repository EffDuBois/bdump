import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000",
});

export default baseAPI;
