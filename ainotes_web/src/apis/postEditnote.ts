import baseAPI from "./services";

interface response {
  title: string;
  body: string;
  embedding: Float32Array;
}

export async function postEditNote(editQuery: {
  note: string;
  query: string;
}): Promise<response> {
  const payload = JSON.stringify(editQuery);
  try {
    const response = await baseAPI.post("/api/notes/edit", payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
