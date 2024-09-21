import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || "http://localhost:8000",
});

export const getDefaultHeaders = () => {
  let headers = new Headers();
  headers.set("Content-Type", "application/json");
  return headers;
};

export default baseAPI;
