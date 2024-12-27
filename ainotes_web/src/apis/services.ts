import axios from "axios";
import { toast } from "sonner";

const baseAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    x_token: process.env.NEXT_PUBLIC_X_API_KEY,
  },
});

export default baseAPI;

baseAPI.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    if (error.status === 500) toast("API is down :(, please try later");
    throw error;
  }
);
