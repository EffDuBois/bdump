import { headers } from "next/headers";
import baseAPI, { getDefaultHeaders } from "./services";

export async function postCreateNote(query: string) {
  try {
    const headers = getDefaultHeaders();
    const response = await baseAPI.post(
      "/notes/create",
      { query },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject;
  }
}
