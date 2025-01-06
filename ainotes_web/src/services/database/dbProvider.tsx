import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { Note } from "./dataModels";
import {
  deleteNoteDirectDb,
  fetchAllNotesDirectDb,
  fetchNoteByPathDirectDb,
  fetchNoteDirectDb,
  putNoteDirectDb,
  storeNoteDirectDb,
} from "./idbService";
import { PartialBy } from "@/utils/custom_types";

interface DbContextType {
  deleteNote: (id: number) => Promise<boolean>;
  fetchAllNotes: () => Promise<Note[]>;
  fetchNoteByPath: (file_name: string, file_path: string) => Promise<Note>;
  fetchNote: (id: number) => Promise<Note>;
  putNote: (data: PartialBy<Note, "id">) => Promise<Note>;
  storeNote: (data: Omit<Note, "id">) => Promise<Note>;
  dbChange: boolean;
}

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider = ({ children }: { children: ReactNode }) => {
  const [dbChange, setDbChange] = useState(false);

  const deleteNote = useCallback(async (id: number) => {
    const result = await deleteNoteDirectDb(id);
    setDbChange((prev) => !prev);
    return result;
  }, []);

  const fetchAllNotes = useCallback(fetchAllNotesDirectDb, []);

  const fetchNoteByPath = useCallback(fetchNoteByPathDirectDb, []);

  const fetchNote = useCallback(fetchNoteDirectDb, []);

  const putNote = useCallback(async (data: PartialBy<Note, "id">) => {
    const result = await putNoteDirectDb(data);
    setDbChange((prev) => !prev);
    return result;
  }, []);

  const storeNote = useCallback(async (data: Omit<Note, "id">) => {
    const result = await storeNoteDirectDb(data);
    setDbChange((prev) => !prev);
    return result;
  }, []);

  return (
    <DbContext.Provider
      value={{
        deleteNote,
        fetchAllNotes,
        fetchNoteByPath,
        fetchNote,
        putNote,
        storeNote,
        dbChange,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;

export const useDb = (): DbContextType => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
};
