import { useEffect, useState } from "react";

const VERSION = 1;

export interface Note {
  id: number;
  path: string;
  content: string;
  embedding?: Float32Array;
}

export enum DBs {
  notes = "NotesDB",
}

export enum Stores {
  notes = "Notes",
}

export interface NotesDbType {
  storeTxnStatus: boolean;
  storeStatus: boolean;
  fetchAllNotes: () => Promise<Note[]>;
  storeNote: (data: Omit<Note, "id">) => Promise<Note>;
  deleteNote: (id: number) => Promise<boolean>;
  putNote: (note: Omit<Note, "id"> & { id?: number }) => Promise<Note>;
}

const useNotesDb = (): NotesDbType => {
  const [db, setDb] = useState<IDBDatabase>();
  const [storeStatus, setStoreStatus] = useState(false);
  const [storeTxnStatus, setStoreTxnStatus] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(false);

  useEffect(() => {
    if (!storeStatus) {
      initDb().then((newDb) => {
        setDb(newDb);
        setStoreStatus(true);
      });
    }
  }, [storeStatus]);

  const fetchAllNotes = (): Promise<Note[]> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setFetchStatus(true);

      if (!db) {
        reject("Database is not initialized yet");
        return;
      }
      const tx = db.transaction(Stores.notes);

      const res = tx.objectStore(Stores.notes).getAll();
      res.onsuccess = () => {
        console.log("fetch txn success");
        setStoreTxnStatus(false);
        resolve(res.result);
      };
      res.onerror = () => {
        setFetchStatus(false);
        reject("Transaction error:" + res.error);
      };
    });
  };

  const fetchNote = (id: string): Promise<Note[]> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setFetchStatus(true);
      if (!db) {
        reject("Database is not initialized yet");
        return;
      }
      const tx = db.transaction(Stores.notes);

      const res = tx.objectStore(Stores.notes).get(id);
      res.onsuccess = () => {
        console.log("fetch txn success");
        setStoreTxnStatus(false);
        resolve(res.result);
      };
      res.onerror = (event) => {
        setFetchStatus(false);
        reject("Transaction error:" + res.error);
      };
    });
  };

  const storeNote = (data: Omit<Note, "id">): Promise<Note> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setStoreTxnStatus(true);
      if (!db) {
        reject("Database is not initialized yet");
        return;
      }
      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).add(data);
      res.onsuccess = () => {
        setStoreTxnStatus(false);
        resolve({ ...data, id: Number(res.result) });
      };
      res.onerror = () => {
        setStoreTxnStatus(false);
        if (res.error?.name == "ConstraintError")
          console.log("File already exists, please use a valid path");
        reject("Transaction error:" + res.error);
      };
    });
  };

  const deleteNote = (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setStoreTxnStatus(true);
      if (!db) {
        reject("Database is not initialized yet");
        return;
      }
      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).delete(id);
      res.onsuccess = () => {
        setStoreTxnStatus(false);
        resolve(true);
      };
      res.onerror = () => {
        setStoreTxnStatus(false);
        reject("Transaction error:" + res.error);
      };
    });
  };

  const putNote = (data: Omit<Note, "id"> & { id?: number }): Promise<Note> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setStoreTxnStatus(true);
      if (!db) {
        reject("Database is not initialized yet");
        return;
      }
      const tx = db.transaction(Stores.notes, "readwrite");
      const store = tx.objectStore(Stores.notes);
      const res = store.put(data);
      res.onsuccess = () => {
        setStoreTxnStatus(false);
        resolve({ ...data, id: Number(res.result) });
      };
      res.onerror = () => {
        setStoreTxnStatus(false);
        reject("Transaction error:" + res.error);
      };
    });
  };
  return {
    storeTxnStatus,
    storeStatus,
    fetchAllNotes,
    storeNote,
    deleteNote,
    putNote,
  };
};

const initDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // open the connection
    const request = indexedDB.open(DBs.notes, VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.notes)) {
        console.log("Creating notes store");
        const notesStore = db.createObjectStore(Stores.notes, {
          keyPath: "id",
          autoIncrement: true,
        });
        notesStore.createIndex("path", "path", { unique: true });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      console.log("initDB success", VERSION);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Database error: ", event);
      reject(false);
    };
  });
};

export default useNotesDb;
