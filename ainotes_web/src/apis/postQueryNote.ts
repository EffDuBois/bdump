import { QueryRequest } from "@/utils/data";
import baseAPI from "./services";

export async function postQueryNote(queryRequest: QueryRequest) {
  try {
    const response = await baseAPI.post(
      "/notes/ask",
      { queryRequest },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
