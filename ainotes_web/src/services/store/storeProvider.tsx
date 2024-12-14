"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useDb } from "../database/dbProvider";
import { Note } from "../database/dataModels";
import storeService from "./storeService";
import { PartialBy } from "@/utils/custom_types";

interface storeContextType {
  notes: Note[];
  notesFetchStatus: boolean;
  createNote: (query: string, currentNote?: Partial<Note>) => Promise<Note>;
  storeNote: (note: PartialBy<Note, "id">) => Promise<Note>;
  putNote: (note: Partial<Note>) => Promise<Note>;
  deleteNote: (id: number) => {};
  queryNotes: (query: string) => Promise<any>;
}

export const StoreContext = createContext<storeContextType | undefined>(
  undefined
);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const notesDb = useDb();
  const { storeNote, deleteNote } = notesDb;
  const storeActions = storeService();

  const [notes, setNotes] = useState<Note[]>([]);
  const [notesFetchStatus, setNoteFetchStatus] = useState(true);

  useEffect(() => {
    setNoteFetchStatus(true);
    if (notesDb.dbStatus && !notesDb.dbWriteStatus) {
      notesDb.fetchAllNotes().then((notes) => setNotes(notes));
    }
    setNoteFetchStatus(false);
  }, [notesDb.dbStatus, notesDb.dbWriteStatus]);

  const createNote = async (query: string, currentNote?: Partial<Note>) => {
    const newNote = await storeActions.createNote(notesDb, query, currentNote);
    if (!newNote) {
      throw new Error("Failed to create note");
    }
    return newNote;
  };
  
  const putNote = async (note: Partial<Note>) =>{
    const newNote = await notesDb.putNote({
      id: note.id ?? 0,
      file_name: note.file_name ?? "",
      content: note.content ?? "",
      path: note.path ?? "",
      transcript: note.transcript ?? ""
    });
    return newNote;
  }
  const queryNotes = async (query: string) => {
    const queryResponse = await storeActions.queryNotes(notes, query);
    return queryResponse;
  };

  return (
    <StoreContext.Provider
      value={{
        notes,
        notesFetchStatus,
        createNote,
        storeNote,
        putNote,
        deleteNote,
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
