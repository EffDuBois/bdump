import { config } from "@/config";
import axios from "axios";

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
});

export default baseAPI;
