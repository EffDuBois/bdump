import { Note } from "./dataModels";
import { fetchNoteByPath, storeNote } from "./idbService";

export const getEmptyNote = async (): Promise<Note | undefined> => {
  try {
    const emptyNote = await fetchNoteByPath("", "");
    if (emptyNote) return emptyNote;
    const newNote = await storeNote({
      content: "",
      file_name: "",
      file_path: "",
      transcript: "",
    });
    if (newNote) {
      return newNote;
    }
    throw Error("Both functions somehow didn't return anything");
  } catch (error: any) {
    console.error("Error getting empty note:", error);
  }
};
