"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getEmptyNote } from "../database/dbUtils";
import { deleteNote, fetchAllNotes, putNote } from "../database/idbService";
import { toast } from "sonner";

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
  updateTranscript: valueOrActionFunction<string>;
  updateTitle: valueOrActionFunction<string>;
}

export const StoreContext = createContext<storeContextType | undefined>(
  undefined
);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesFetchStatus, setNoteFetchStatus] = useState(false);
  const [fetchDependency, setFetchDependency] = useState(false);
  const toggleFetchDependency = () => setFetchDependency((prev) => !prev);

  const fetchNotes = () => {
    console.log("fetching notes");

    setNoteFetchStatus(true);
    fetchAllNotes()
      .then((notes) => {
        setNotes(notes);
      })
      .catch((error) => console.error("Failed to fetch notes:", error))
      .finally(() => setNoteFetchStatus(false));
  };

  const [currentNote, setCurrentNote] = useState<Note>();

  const initCurrentNote = () => {
    console.log("Init note");
    getEmptyNote().then((note) => {
      setCurrentNote(note);
    });
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchDependency, currentNote]);

  const updateCurrentNote: valueOrActionFunction<Note> = (updateObj) => {
    setCurrentNote((oldNote) => {
      if (!oldNote) {
        initCurrentNote();
      }
      if (oldNote) {
        if (typeof updateObj === "function") {
          putNote(updateObj(oldNote))
            .then((note) => {
              setCurrentNote(note);
            })
            .catch((error) => console.error(error));
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
      }
      return oldNote;
    });
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
  };

  const deleteNoteById = (id: Note["id"]) => {
    deleteNote(id).then(() => {
      toggleFetchDependency();
    });
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
