import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  // headers: {"x_api_key":""}
});

export default baseAPI;
