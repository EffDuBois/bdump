import { postCreateNote } from "@/apis/postCreateNote";
import { postEditNote } from "@/apis/postEditnote";
import postQueryNote from "@/apis/postQueryNote";
import { Note } from "@/services/database/dataModels";
import { fetchAllNotesDirectDb } from "@/services/database/idbService";
import { Full } from "@/utils/custom_types";
import { AxiosError, isAxiosError } from "axios";
import { toast } from "sonner";

const LLM_EXHAUSTED_MESSAGE = "LLM API rate limit exceeded.";

export const createNote = async (currentNote: Note): Promise<Note> => {
  try {
    const response = await postCreateNote(currentNote.transcript);
    return {
      ...currentNote,
      file_name: currentNote.file_name || response?.title,
      file_path: currentNote.file_path || "",
      transcript: "",
      content: response?.body,
      embedding: response?.embedding,
    };
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.status === 503 &&
      error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
    )
      toast("Sorry! LLM API is exhausted");
    else console.error(error);
  }
  return currentNote;
};

export const editNote = async (currentNote: Note): Promise<Note> => {
  try {
    const response = await postEditNote({
      note: currentNote?.content,
      query: currentNote?.transcript,
    });
    return {
      ...currentNote,
      file_name: currentNote.file_name || response.title,
      file_path: currentNote.file_path || "",
      transcript: "",
      content: response.body,
      embedding: response.embedding,
    };
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.status === 503 &&
      error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
    )
      toast("Sorry! LLM API is exhausted");
    else console.error(error);
  }
  return currentNote;
};

export const queryNotes = async (query: string) => {
  try {
    const notes = await fetchAllNotesDirectDb();
    const response = await postQueryNote({
      query: query,
      data: notes
        .filter((note): note is Full<Note> => note.embedding !== undefined)
        .map((note) => {
          return {
            id: note.id,
            path: note.file_path + note.file_name,
            note: note.content,
            embedding: note.embedding,
          };
        }),
    });
    return response.response;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.status === 503 &&
      error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
    )
      toast("Sorry! LLM API is exhausted");
    else console.error(error);
  }
};
