"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Note } from "../database/dataModels";
import { useDb } from "../database/Provider";

interface storeContextType {
  notes: Note[];
  notesFetchStatus: boolean;
}

export const StoreContext = createContext<storeContextType | undefined>(
  undefined
);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = useDb();

  const [notes, setNotes] = useState<Note[]>([]);
  const [notesFetchStatus, setNoteFetchStatus] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      setNoteFetchStatus(true);
      try {
        const notes = await db.fetchAllNotes();
        if (notes) {
          setNotes(notes);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
      setNoteFetchStatus(false);
    };
    fetchNotes();
  }, [db.dbStatus]);

  return (
    <StoreContext.Provider
      value={{
        notes,
        notesFetchStatus,
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
