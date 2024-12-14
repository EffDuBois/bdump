import { useEffect, useState } from "react";

import { Note, Stores, DBs } from "./dataModels";
import { PartialBy } from "@/utils/custom_types";

const VERSION = 1;

const idbService = () => {
  const initDb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
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

  const fetchAllNotes = (db: IDBDatabase): Promise<Note[]> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(Stores.notes);

      const res = tx.objectStore(Stores.notes).getAll();
      res.onsuccess = () => {
        console.log("fetch txn success");
        resolve(res.result);
      };
      res.onerror = () => {
        reject("Transaction error:" + res.error);
      };
    });
  };

  const fetchNote = (db: IDBDatabase, id: string): Promise<Note> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(Stores.notes);

      const res = tx.objectStore(Stores.notes).get(id);
      res.onsuccess = () => {
        console.log("fetch txn success");
        resolve(res.result[0]);
      };
      res.onerror = (event) => {
        reject("Transaction error:" + res.error);
      };
    });
  };

  const storeNote = (db: IDBDatabase, data: Omit<Note, "id">): Promise<Note> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).add(data);
      res.onsuccess = () => {
        resolve({ ...data, id: Number(res.result) });
      };
      res.onerror = () => {
        if (res.error?.name == "ConstraintError")
          console.log("File already exists, please use a valid path");
        reject("Transaction error:" + res.error);
      };
    });
  };

  const deleteNote = (db: IDBDatabase, id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).delete(id);
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        reject("Transaction error:" + res.error);
      };
    });
  };

  const putNote = (db: IDBDatabase, data: PartialBy<Note, "id">): Promise<Note> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(Stores.notes, "readwrite");
      const store = tx.objectStore(Stores.notes);
      const res = store.put(data);
      res.onsuccess = () => {
        resolve({ ...data, id: Number(res.result) });
      };
      res.onerror = () => {
        reject("Transaction error:" + res.error);
      };
    });
  };

  return {
    initDb,
    fetchAllNotes,
    fetchNote,
    storeNote,
    deleteNote,
    putNote
  };
};

export default idbService;
