import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Note } from "./dataModels";
import { PartialBy } from "@/utils/custom_types";
import idbService from "./idbService";

const transactionInProgressError = new Error("Txn already in progress");
const dbInitError = new Error("Db not initialised");

export interface DbContextType {
  dbStatus: boolean;
  dbWriteStatus: boolean;
  dbReadStatus: boolean;
  fetchAllNotes: () => Promise<Note[]>;
  fetchNote: (id: string) => Promise<Note>;
  storeNote: (note: PartialBy<Note, "id">) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  putNote: (note: PartialBy<Note, "id">) => Promise<Note>;
}

export const DbContext = createContext<DbContextType | undefined>(undefined);

const DbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dbService = idbService();
  const [db, setDb] = useState<IDBDatabase>();
  const [dbStatus, setDbStatus] = useState(false);
  const [dbWriteStatus, setDbWriteStatus] = useState(false);
  const [dbReadStatus, setdbReadStatus] = useState(false);

  useEffect(() => {
    if (!dbStatus) {
      dbService.initDb().then((newDb) => {
        setDb(newDb);
        setDbStatus(true);
      });
    }
  }, [dbStatus]);

  const fetchAllNotes = async () => {
    try {
      if (dbWriteStatus) throw transactionInProgressError;
      setdbReadStatus(true);

      if (!db) {
        throw dbInitError;
      }
      const notes = await dbService.fetchAllNotes(db);
      setdbReadStatus(false);
      return notes;
    } catch (error) {
      console.error("Error in fetchAllNotes:", error);
      throw error;
    }
  };

  const fetchNote = async (id: string) => {
    try {
      if (dbWriteStatus) throw transactionInProgressError;
      setdbReadStatus(true);

      if (!db) {
        throw dbInitError;
      }
      const note = await dbService.fetchNote(db, id);
      setdbReadStatus(false);
      return note;
    } catch (error) {
      console.error("Error in fetchNote with id:", id, error);
      throw error;
    }
  };

  const storeNote = async (note: PartialBy<Note, "id">) => {
    try {
      if (dbReadStatus) throw transactionInProgressError;
      setDbWriteStatus(true);

      if (!db) {
        throw dbInitError;
      }
      const newNote = await dbService.storeNote(db, note);
      setDbWriteStatus(false);
      return newNote;
    } catch (error) {
      console.error("Error in storeNote with note:", note, error);
      throw error;
    }
  };

  const deleteNote = async (id: number) => {
    try {
      if (dbReadStatus) throw transactionInProgressError;
      setDbWriteStatus(true);

      if (!db) {
        throw dbInitError;
      }
      await dbService.deleteNote(db, id);
      setDbWriteStatus(false);
    } catch (error) {
      console.error("Error in deleteNote with id:", id, error);
      throw error;
    }
  };

  const putNote = async (note: PartialBy<Note, "id">) => {
    try {
      if (dbReadStatus) throw transactionInProgressError;
      setDbWriteStatus(true);

      if (!db) {
        throw dbInitError;
      }
      const updatedNote = await dbService.putNote(db, note);
      setDbWriteStatus(false);
      return updatedNote;
    } catch (error) {
      console.error("Error in putNote with note:", note, error);
      throw error;
    }
  };

  return (
    <DbContext.Provider
      value={{
        dbStatus,
        dbWriteStatus,
        dbReadStatus,
        fetchAllNotes,
        fetchNote,
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

  if (!db) throw new Error("Critical error: db context missing");
  return db;
};
