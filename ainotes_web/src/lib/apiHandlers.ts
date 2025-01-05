import postQueryNote from "@/apis/postQueryNote";
import { Note } from "@/services/database/dataModels";
import { fetchAllNotes } from "@/services/database/idbService";
import { Full } from "@/utils/custom_types";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const LLM_EXHAUSTED_MESSAGE = "LLM API rate limit exceeded.";

export const createNote = () => {
  if (currentNote?.transcript) {
    postCreateNote(currentNote?.transcript)
      .then((res) => {
        updateCurrentNote((currentNote) => {
          return {
            ...currentNote,
            file_name: currentNote.file_name || res.title,
            file_path: currentNote.file_path || "",
            transcript: "",
            content: res.body,
            embedding: res.embedding,
          };
        });
      })
      .catch((error) => {
        if (
          error instanceof AxiosError &&
          error.status === 503 &&
          error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
        )
          toast("Sorry! LLM API is exhausted");
        else console.error(error);
      })
      .finally(() => {});
  } else {
  }
};

export const editNote = () => {
  if (currentNote?.transcript) {
    postEditNote({
      note: currentNote?.content,
      query: currentNote?.transcript,
    })
      .then((res) => {
        updateCurrentNote((currentNote) => {
          return {
            ...currentNote,
            file_name: currentNote.file_name || res.title,
            file_path: currentNote.file_path || "",
            transcript: "",
            content: res.body,
            embedding: res.embedding,
          };
        });
      })
      .catch((error) => {
        if (
          isAxiosError(error) &&
          error.status === 503 &&
          error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
        )
          toast("Sorry! LLM API is exhausted");
        else console.error(error);
      })
      .finally(() => {});
  } else {
  }
};

export const queryNotes = async (query: string) => {
  const notes = await fetchAllNotes();
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
  }).catch((error) => {
    if (
      isAxiosError(error) &&
      error.status === 503 &&
      error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
    )
      toast("Sorry! LLM API is exhausted");
    else console.error(error);
  });
  return response;
};
