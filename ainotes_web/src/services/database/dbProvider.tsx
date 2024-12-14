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
    if (dbWriteStatus) throw transactionInProgressError;
    setdbReadStatus(true);

    if (!db) {
      throw dbInitError;
    }
    const notes = await dbService.fetchAllNotes(db);
    setdbReadStatus(false);
    return notes;
  };
  const fetchNote = async (id: string) => {
    if (dbWriteStatus) throw transactionInProgressError;
    setdbReadStatus(true);

    if (!db) {
      throw dbInitError;
    }
    const note = await dbService.fetchNote(db, id);
    setdbReadStatus(false);
    return note;
  };

  const storeNote = async (note: PartialBy<Note, "id">) => {
    if (dbReadStatus) throw transactionInProgressError;
    setDbWriteStatus(true);

    if (!db) {
      throw dbInitError;
    }
    const newNote = await dbService.storeNote(db, note);
    setDbWriteStatus(false);
    return newNote;
  };

  const deleteNote = async (id: number) => {
    if (dbReadStatus) throw transactionInProgressError;
    setDbWriteStatus(true);

    if (!db) {
      throw dbInitError;
    }
    await dbService.deleteNote(db, id);
    setDbWriteStatus(false);
  };

  const putNote = async (note: PartialBy<Note, "id">) => {
    if (dbReadStatus) throw transactionInProgressError;
    setDbWriteStatus(true);

    if (!db) {
      throw dbInitError;
    }
    const updatedNote = await dbService.putNote(db, note);
    setDbWriteStatus(false);
    return updatedNote;
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
