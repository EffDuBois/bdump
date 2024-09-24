import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

export default baseAPI;
