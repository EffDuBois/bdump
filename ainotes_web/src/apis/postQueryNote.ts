import { Note } from "@/services/database/dataModels";
import baseAPI from "./services";
import { Full } from "@/utils/custom_types";
import { AxiosError } from "axios";

export interface query {
  query: string;
  data: Full<Note>[];
}

export default async function postQueryNote(query: query) {
  const payload = JSON.stringify(query);
  try {
    const response = await baseAPI.post("/api/notes/ask", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
