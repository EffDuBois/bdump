import { Note } from "@/services/database/dataModels";
import baseAPI from "./services";
export interface query {
  query: string;
  data: { id: number; path: string; note: string; embedding: Float32Array }[];
}
export interface response {
  response: string;
}

export default async function postQueryNote(query: query): Promise<response> {
  const payload = JSON.stringify(query);
  try {
    const response = await baseAPI.post("/api/notes/ask", payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
