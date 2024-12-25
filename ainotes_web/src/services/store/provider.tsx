"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AskData, Note } from "../database/dataModels";
import { getEmptyNote } from "../database/dbUtils";
import { deleteNote, fetchAllNotes, putNote } from "../database/idbService";
import { toast } from "sonner";
import { postCreateNote } from "@/apis/postCreateNote";
import { AxiosError } from "axios";
import postQueryNote from "@/apis/postQueryNote";
import { Full } from "@/utils/custom_types";

export type valueOrActionFunction<T> = (
  updateMethod: T | ((oldvalue: T) => T)
) => void;

export interface storeContextType {
  notes: Note[];
  notesFetchStatus: boolean;
  currentNote?: Note;
  fetchNotes: () => void;
  initCurrentNote: () => void;
  setCurrentNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  updateCurrentNote: valueOrActionFunction<Note>;
  deleteNoteById: (id: Note["id"]) => void;
  askData: { query: string; response: string };
  setAskData: React.Dispatch<React.SetStateAction<AskData>>;
  updateTranscript: valueOrActionFunction<string>;
  updateQuery: valueOrActionFunction<string>;
  updateTitle: valueOrActionFunction<string>;
  apiStatus: boolean;
  createNote: () => void;
  queryNotes: () => void;
}

export const StoreContext = createContext<storeContextType | undefined>(
  undefined
);

const LLM_EXHAUSTED_MESSAGE = "LLM API rate limit exceeded.";

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesFetchStatus, setNoteFetchStatus] = useState(false);
  const [fetchDependency, setFetchDependency] = useState(false);
  const toggleFetchDependency = () => setFetchDependency((prev) => !prev);

  const fetchNotes = () => {
    setNoteFetchStatus(true);
    fetchAllNotes()
      .then((notes) => {
        setNotes(notes);
      })
      .catch((error) => console.error("Failed to fetch notes:", error))
      .finally(() => setNoteFetchStatus(false));
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchDependency]);

  const [currentNote, setCurrentNote] = useState<Note>();

  const initCurrentNote = () => {
    console.log("Init note");
    getEmptyNote().then((note) => {
      setCurrentNote(note);
      toggleFetchDependency();
    });
  };

  const updateCurrentNote: valueOrActionFunction<Note> = (updateObj) => {
    if (!currentNote) initCurrentNote();
    if (typeof updateObj === "function") {
      setCurrentNote((oldNote) => {
        if (oldNote) {
          putNote(updateObj(oldNote))
            .then((note) => {
              setCurrentNote(note);
            })
            .catch((error) => console.error(error));
        }
        return oldNote;
      });
    } else {
      putNote(updateObj)
        .then((note) => {
          setCurrentNote(note);
        })
        .catch((error) => {
          if (error.name === "DataError")
            toast("File with name Already Exists");
          console.error(error);
        });
    }
  };

  //utility
  const updateTranscript: valueOrActionFunction<string> = (updateObj) => {
    if (typeof updateObj === "function") {
      updateCurrentNote((oldNote) => {
        // console.log(updateObj(oldNote.transcript));
        return {
          ...oldNote,
          transcript: updateObj(oldNote.transcript),
        };
      });
    } else {
      updateCurrentNote((oldnote) => {
        return { ...oldnote, transcript: updateObj };
      });
    }
  };

  const updateTitle: valueOrActionFunction<string> = (updateObj) => {
    if (typeof updateObj === "function") {
      updateCurrentNote((oldNote) => {
        return {
          ...oldNote,
          file_name: updateObj(oldNote.transcript),
        };
      });
    } else {
      updateCurrentNote((oldnote) => {
        return { ...oldnote, file_name: updateObj };
      });
    }
    toggleFetchDependency();
  };

  const deleteNoteById = (id: Note["id"]) => {
    deleteNote(id).then(() => {
      toggleFetchDependency();
    });
  };

  const [askData, setAskData] = useState<AskData>({
    query: "",
    response: "",
  });

  //utility
  const updateQuery: valueOrActionFunction<string> = async (updateMethod) => {
    if (typeof updateMethod === "string") {
      setAskData((oldData) => {
        return { ...oldData, query: updateMethod };
      });
    } else {
      setAskData((oldNote) => {
        return { ...oldNote, query: updateMethod(oldNote.query) };
      });
    }
  };

  const [apiStatus, setApiStatus] = useState(false);

  const createNote = () => {
    setApiStatus(true);
    if (currentNote?.transcript) {
      postCreateNote(currentNote?.content + " \n " + currentNote?.transcript)
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
        .finally(() => {
          setApiStatus(false);
        });
    } else {
      setApiStatus(false);
    }
  };

  const queryNotes = () => {
    setApiStatus(true);
    if (askData.query !== "") {
      postQueryNote({
        query: askData.query,
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
      })
        .then((res) => {
          setAskData((prev) => {
            return {
              query: "",
              response: prev.query + "\n\n\n\n " + res.response,
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
        .finally(() => {
          setApiStatus(false);
        });
    } else {
      console.log("ASK:No query");
      setApiStatus(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        notes,
        notesFetchStatus,
        fetchNotes,
        currentNote,
        initCurrentNote,
        setCurrentNote,
        updateCurrentNote,
        updateTranscript,
        updateTitle,
        deleteNoteById,
        askData,
        setAskData,
        updateQuery,
        apiStatus,
        createNote,
        queryNotes,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) throw new Error("Critical error: store context missing");
  return store;
};
