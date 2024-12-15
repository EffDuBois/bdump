import { Note } from "../database/dataModels";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";
import idbService from "../database/idbService";
import { useStore } from "./storeProvider";
import { useDb } from "../database/Provider";
import { AxiosError } from "axios";

const useStoreActions = () => {
  const db = useDb();
  const { notes } = useStore();

  const createNote = async (query: string, currentNote?: Partial<Note>) => {
    try {
      const createResponse = await postCreateNote(query);
      const dbInput = {
        id: currentNote?.id,
        file_name: currentNote?.file_name || createResponse.title,
        file_path: currentNote?.file_path || "",
        transcript: "",
        content: createResponse.body,
        embedding: createResponse.embedding,
      };
      const newNote = await db.putNote(dbInput);
      return newNote;
    } catch (error) {
      //#todo add a pop up
      if (error instanceof AxiosError && error.status === 429)
        console.log("API is exhausted");
      else console.log("API Error pop up");
    }
  };

  const queryNotes = async (query: string) => {
    try {
      const queryResponse = await postQueryNote({
        query,
        data: notes.filter(
          (note): note is Note & { embedding: Float32Array } =>
            note.embedding !== undefined
        ),
      });
      return queryResponse;
    } catch (error) {
      if (error instanceof AxiosError && error.status === 429)
        console.log("API is exhausted");
      else console.log("API Error pop up");
    }
  };

  const getEmptyNote = async () => {
    try {
      let emptyNote = await db.fetchNoteByPath("", "");
      if (!emptyNote) {
        emptyNote = await db.storeNote({
          content: "",
          file_name: "",
          file_path: "",
          transcript: "",
        });
      }
      return emptyNote;
    } catch (error) {
      console.error("Failed to get empty note:", error);
      throw error;
    }
  };

  return {
    createNote,
    queryNotes,
    getEmptyNote,
  };
};
export default useStoreActions;
