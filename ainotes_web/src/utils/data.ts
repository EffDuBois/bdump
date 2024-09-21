import { useState } from "react";

const version = 1;

export interface Note {
  id: string;
  path: string;
  content: string;
  vembed: Float32Array | never[];
}

export enum DBs {
  notes = "NotesDB",
}

export enum Stores {
  notes = "Notes",
}

export interface NotesDbType {
  storeTxnStatus: boolean;
  fetchAllNotes: () => Promise<Note[]>;
  storeNote: (data: Omit<Note, "id">) => Promise<Note>;
  deleteNote: (id: string) => Promise<boolean>;
  updateNote: (id: string, data: Omit<Note, "id">) => Promise<boolean>;
}

const useNotesDb = () => {
  const [storeTxnStatus, setStoreTxnStatus] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(false);

  const fetchAllNotes = (): Promise<Note[]> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setFetchStatus(true);
      initDb().then((db) => {
        const tx = db.transaction(Stores.notes);

        const res = tx.objectStore(Stores.notes).getAll();
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
    });
  };

  const fetchNote = (id: string): Promise<Note[]> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setFetchStatus(true);
      initDb().then((db) => {
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
    });
  };

  const storeNote = (data: Omit<Note, "id">): Promise<Note> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setStoreTxnStatus(true);
      initDb().then((db) => {
        const tx = db.transaction(Stores.notes, "readwrite");
        const res = tx.objectStore(Stores.notes).add(data);
        res.onsuccess = () => {
          setStoreTxnStatus(false);
          resolve({ ...data, id: String(res.result) });
        };
        res.onerror = () => {
          setStoreTxnStatus(false);
          if (res.error?.name == "ConstraintError")
            console.log("File already exists, please use a valid path");
          reject("Transaction error:" + res.error);
        };
      });
    });
  };

  const deleteNote = (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setStoreTxnStatus(true);
      initDb().then((db) => {
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
    });
  };

  const updateNote = (id: string, data: Omit<Note, "id">): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (storeTxnStatus) reject("Txn already in progress");
      setStoreTxnStatus(true);
      initDb().then((db) => {
        const tx = db.transaction(Stores.notes, "readwrite");
        const store = tx.objectStore(Stores.notes);
        const res = store.put(data, id);
        res.onsuccess = () => {
          setStoreTxnStatus(false);
          resolve(true);
        };
        res.onerror = () => {
          setStoreTxnStatus(false);
          reject("Transaction error:" + res.error);
        };
      });
    });
  };
  return { storeTxnStatus, fetchAllNotes, storeNote, deleteNote, updateNote };
};

const initDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // open the connection
    const request = indexedDB.open(DBs.notes, version);

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
        notesStore.createIndex("content", "content");
        notesStore.createIndex("vembed", "vembed");
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const version = db.version;
      console.log("initDB success", version);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Database error: ", event);
      reject(false);
    };
  });
};

export default useNotesDb;
