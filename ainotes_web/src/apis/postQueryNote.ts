import baseAPI from "./services";

export interface QueryRequest {
  query: string;
  data: {
    id: number;
    path: string;
    note: string;
    embedding: Float32Array;
  }[];
}

export default async function postQueryNote(queryRequest: QueryRequest) {
  const payload = JSON.stringify(queryRequest);
  try {
    const response = await baseAPI.post("/api/notes/ask", queryRequest, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
