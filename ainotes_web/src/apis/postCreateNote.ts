import baseAPI from "./services";

export async function postCreateNote(query: string) {
  try {
    const data = JSON.stringify({ query: query });
    const response = await baseAPI.post("/notes/create", {
      data: data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
