import { createContext, useContext, useState } from "react";
import idbService from "./idbService";
import { PartialBy } from "@/utils/custom_types";
import { Note } from "./dataModels";

type DbContextType = {
  dbStatus: boolean;
  fetchAllNotes: () => Promise<Note[] | undefined>;
  fetchNote: (id: string) => Promise<Note | undefined>;
  fetchNoteByPath: (
    file_name: string,
    file_path: string
  ) => Promise<Note | undefined>;
  storeNote: (note: PartialBy<Note, "id">) => Promise<Note | undefined>;
  deleteNote: (id: number) => Promise<boolean | undefined>;
  putNote: (note: Partial<Note>) => Promise<Note>;
};

const DbContext = createContext<DbContextType | undefined>(undefined);

import { ReactNode } from "react";

const DbProvider = ({ children }: { children: ReactNode }) => {
  const db = idbService();
  const [dbStatus, setDbStatus] = useState(false);

  const fetchAllNotes = async () => {
    setDbStatus(true);
    try {
      return await db.fetchAllNotes();
    } catch (error) {
      console.error("Failed to fetch all notes:", error);
    } finally {
      setDbStatus(false);
    }
  };

  const fetchNote = async (id: string) => {
    setDbStatus(true);
    try {
      return await db.fetchNote(id);
    } catch (error) {
      console.error("Failed to fetch note:", error);
    } finally {
      setDbStatus(false);
    }
  };

  const fetchNoteByPath = async (file_name: string, file_path: string) => {
    setDbStatus(true);
    try {
      return await db.fetchNoteByPath(file_name, file_path);
    } catch (error) {
      console.error("Failed to fetch note by path:", error);
    } finally {
      setDbStatus(false);
    }
  };

  const storeNote = async (note: PartialBy<Note, "id">) => {
    setDbStatus(true);
    try {
      return await db.storeNote(note);
    } catch (error) {
      console.error("Failed to store note:", error);
    } finally {
      setDbStatus(false);
    }
  };

  const deleteNote = async (id: number) => {
    setDbStatus(true);
    try {
      return await db.deleteNote(id);
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setDbStatus(false);
    }
  };

  const putNote = async (note: Partial<Note>) => {
    setDbStatus(true);
    try {
      const newNote = await db.putNote({
        id: note.id ?? 0,
        file_name: note.file_name ?? "",
        content: note.content ?? "",
        file_path: note.file_path ?? "",
        transcript: note.transcript ?? "",
      });
      return newNote;
    } catch (error) {
      console.error("Failed to put note:", note, error);
      throw error;
    } finally {
      setDbStatus(false);
    }
  };

  return (
    <DbContext.Provider
      value={{
        dbStatus,
        fetchAllNotes,
        fetchNote,
        fetchNoteByPath,
        storeNote,
        deleteNote,
        putNote,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDb = () => {
  const db = useContext(DbContext);

  if (!db) throw new Error("Critical error: store context missing");
  return db;
};
