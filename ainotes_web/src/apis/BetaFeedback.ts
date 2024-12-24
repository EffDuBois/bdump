import baseAPI from "./services";

export async function getBetaUsers() {
  try {
    const response = await baseAPI.get("/api/beta/users");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function postBetaFeedback(user: string, feedback: string) {
  try {
    const payload = JSON.stringify({ feedback });
    const response = await baseAPI.post(`/api/beta/feedback/${user}`, payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
