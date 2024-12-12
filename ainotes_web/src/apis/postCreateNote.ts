import baseAPI from "./services";

export async function postCreateNote(query: string) {
  try {
    const response = await baseAPI.post(
      "/api/notes/create",
      { query },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
