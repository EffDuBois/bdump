import { Note } from "../database/dataModels";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";
import { useStore } from "./provider";
import { AxiosError } from "axios";
import { useState } from "react";
import { useAlert } from "../AlertProvider";
import { Full } from "@/utils/custom_types";

const LLM_EXHAUSTED_MESSAGE = "LLM API rate limit exceeded.";

const useStoreActions = () => {
  const store = useStore();
  const alert = useAlert();

  const [storeActionStatus, setStoreActionStatus] = useState(false);

  const createNote = () => {
    setStoreActionStatus(true);
    if (store.currentNote?.transcript)
      postCreateNote(store.currentNote?.transcript)
        .then((res) => {
          store.updateCurrentNote((currentNote) => {
            return {
              ...currentNote,
              file_name: currentNote.file_name || res.title,
              file_path: currentNote?.file_path || "",
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
            alert("Sorry! LLM API is exhausted");
          else console.error(error);
        })
        .finally(() => setStoreActionStatus(false));
  };

  const queryNotes = () => {
    setStoreActionStatus(true);
    // store.notes
    //   .filter((note): note is Full<Note> => note.embedding !== undefined)
    //   .map((note) => {
    //     console.log([...note.embedding.embedding]);
    //   });

    postQueryNote({
      query: store.askData.query,
      data: store.notes
        .filter((note): note is Full<Note> => note.embedding !== undefined)
        .map((note) => {
          return {
            id: note.id,
            path: note.file_path + note.file_name,
            note: note.content,
            embedding: note.embedding,
          };
        }),
    })
      .then((res) => {
        store.setAskData((prev) => {
          return { query: "", response: prev.query + " \\n " + res.response };
        });
      })
      .catch((error) => {
        if (
          error instanceof AxiosError &&
          error.status === 503 &&
          error.response?.data.detail === LLM_EXHAUSTED_MESSAGE
        )
          alert("Sorry! LLM API is exhausted");
        else console.error(error);
      })
      .finally(() => setStoreActionStatus(false));
  };

  return { storeActionStatus, createNote, queryNotes };
};

export default useStoreActions;
