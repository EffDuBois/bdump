import baseAPI from "./services";

export interface query {
  query: string;
  data: {
    id: number;
    path: string;
    note: string;
    embedding: Float32Array;
  }[];
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
