"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AskData, Note } from "../database/dataModels";
import { getEmptyNote } from "../database/dbUtils";
import { fetchAllNotes, putNote } from "../database/idbService";
import { useAlert } from "../AlertProvider";

export type valueOrActionFunction<T> = (
  updateMethod: T | ((oldvalue: T) => T)
) => void;

export interface storeContextType {
  notes: Note[];
  notesFetchStatus: boolean;
  currentNote?: Note;
  currentNoteStatus: boolean;
  fetchNotes: () => void;
  updateCurrentNote: valueOrActionFunction<Note>;
  initCurrentNote: () => void;
  askData: { query: string; response: string };
  setAskData: React.Dispatch<React.SetStateAction<AskData>>;
  updateTranscript: valueOrActionFunction<string>;
  updateQuery: valueOrActionFunction<string>;
}

export const StoreContext = createContext<storeContextType | undefined>(
  undefined
);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const alert = useAlert();

  const [notes, setNotes] = useState<Note[]>([]);
  const [notesFetchStatus, setNoteFetchStatus] = useState(false);

  const fetchNotes = () => {
    setNoteFetchStatus(true);
    fetchAllNotes()
      .then((notes) => {
        setNotes(notes);
      })
      .catch((error) => console.error("Failed to fetch notes:", error))
      .finally(() => setNoteFetchStatus(false));
  };

  const [currentNote, setCurrentNote] = useState<Note>();
  const [currentNoteStatus, setCurrentNoteStatus] = useState<boolean>(false);

  useEffect(() => {
    if (!!currentNote) {
      setCurrentNoteStatus(true);
    }
  }, [currentNote]);

  const initCurrentNote = () => {
    console.log("Init note");
    getEmptyNote().then((note) => {
      setCurrentNote(note);
    });
  };

  const updateCurrentNote: valueOrActionFunction<Note> = (updateObj) => {
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
            alert("File with name Already Exists");
          console.error(error);
        });
    }
  };

  //utility function
  const updateTranscript: valueOrActionFunction<string> = (updateObj) => {
    if (typeof updateObj === "function") {
      updateCurrentNote((oldNote) => {
        console.log(updateObj(oldNote.transcript));
        return {
          ...oldNote,
          transcript: updateObj(oldNote.transcript),
        };
      });
    } else {
      updateCurrentNote({ ...currentNote, transcript: updateObj } as Note);
    }
  };

  const [askData, setAskData] = useState<AskData>({
    query: "",
    response: "",
  });

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

  return (
    <StoreContext.Provider
      value={{
        notes,
        notesFetchStatus,
        currentNote,
        currentNoteStatus,
        fetchNotes,
        initCurrentNote,
        updateCurrentNote,
        askData,
        setAskData,
        updateTranscript,
        updateQuery,
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
