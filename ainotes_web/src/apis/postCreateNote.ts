import baseAPI from "./services";

interface response {
  title: string;
  body: string;
  embedding: Float32Array;
}

export async function postCreateNote(query: string): Promise<response> {
  const payload = JSON.stringify({ query });
  try {
    const response = await baseAPI.post("/api/notes/create", payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
