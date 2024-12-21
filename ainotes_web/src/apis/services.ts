import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    x_token: process.env.NEXT_PUBLIC_X_API_KEY,
  },
});

export default baseAPI;
