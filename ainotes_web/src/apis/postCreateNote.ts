import baseAPI from "./services";

export async function postCreateNote(query: string) {
  const payload = JSON.stringify({ query });
  try {
    const response = await baseAPI.post("/api/notes/create", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
