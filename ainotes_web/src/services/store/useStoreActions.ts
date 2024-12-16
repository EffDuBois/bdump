import { Note } from "../database/dataModels";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";
import { useStore } from "./storeProvider";
import { useDb } from "../database/Provider";
import { AxiosError } from "axios";
import { useState } from "react";
import { useAlert } from "../AlertProvider";

const useStoreActions = () => {
  const db = useDb();
  const { notes } = useStore();
  const alert = useAlert();

  const [storeActionStatus, setStoreActionStatus] = useState(false);

  const createNote = async (query: string, currentNote?: Partial<Note>) => {
    setStoreActionStatus(true);
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
      try {
        const newNote = await db.putNote(dbInput);
        return newNote;
      } catch (error) {
        alert("Please choose a unique name for the file");
      }
    } catch (error) {
      //#todo add a pop up
      if (
        error instanceof AxiosError &&
        error.status === 503 &&
        error.response?.data.detail === "Gemini API rate limit exceeded."
      )
        alert("API is exhausted");
      else console.log(error);
    } finally {
      setStoreActionStatus(false);
    }
  };

  const queryNotes = async (query: string) => {
    setStoreActionStatus(true);
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
      if (
        error instanceof AxiosError &&
        error.status === 503 &&
        error.response?.data.detail === "LLM API rate limit exceeded."
      )
      alert("API is exhausted");
      else console.log("API Error pop up");
    } finally {
      setStoreActionStatus(false);
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

  return { storeActionStatus, createNote, queryNotes, getEmptyNote };
};
export default useStoreActions;
