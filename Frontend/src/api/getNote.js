import axios from "axios";

export async function getNote(input) {
  try {
    const response = await axios.post("http://127.0.0.1:5000/", {
      content: input,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}
