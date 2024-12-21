import { Note, Stores, DBs } from "./dataModels";
import { PartialBy } from "@/utils/custom_types";

const VERSION = 7;

const initDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBs.notes, VERSION);

    request.onupgradeneeded = (e) => {
      console.log(e);

      const storeCreateIndex = (
        objectStore: IDBObjectStore,
        name: string,
        keyPath: string | string[],
        options: IDBIndexParameters
      ) => {
        if (!objectStore.indexNames.contains(name)) {
          objectStore.createIndex(name, keyPath, options);
        }
      };

      const db = request.result;
      const transaction = request.transaction;
      if (!transaction) {
        console.error("Transaction is null");
        return;
      }
      if (e.oldVersion === 0) {
        // if the data object store doesn't exist, create it
        console.log("Creating notes store");
        const notesStore = db.createObjectStore(Stores.notes, {
          keyPath: "id",
          autoIncrement: true,
        });
        storeCreateIndex(notesStore, "path", ["file_path", "file_name"], {
          unique: true,
        });
        storeCreateIndex(notesStore, "transcript", "transcript", {
          unique: false,
        });
        storeCreateIndex(notesStore, "content", "content", { unique: false });
        storeCreateIndex(notesStore, "embedding", "embedding", {
          unique: false,
        });
      } else if (e.oldVersion < 5) {
        const notesStore = transaction.objectStore(Stores.notes);
        if (e.oldVersion < 8) {
          notesStore.deleteIndex("path");
          storeCreateIndex(notesStore, "path", ["file_path", "file_name"], {
            unique: true,
          });
          storeCreateIndex(notesStore, "transcript", "transcript", {
            unique: false,
          });
          storeCreateIndex(notesStore, "content", "content", {
            unique: false,
          });
          storeCreateIndex(notesStore, "embedding", "embedding", {
            unique: false,
          });
        }

        const getAllRequest = notesStore.getAll();
        getAllRequest.onsuccess = () => {
          const notes = getAllRequest.result;
          notes.forEach((note: any) => {
            const match = note.path.match(/^(.*\/)([^\/]+)$/);
            if (match) {
              note.file_path = match[1];
              note.file_name = match[2];
              delete note.path;
              notesStore.put(note);
            }
          });
        };
        getAllRequest.onerror = () => {
          console.error(
            "Error fetching notes for migration:",
            getAllRequest.error
          );
        };
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      // console.log("initDB success", VERSION);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("error initialising db: ", event);
      reject(false);
    };
  });
};

export const fetchAllNotes = (): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
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
  });
};

export const fetchNote = (id: string): Promise<Note> => {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const tx = db.transaction(Stores.notes);

      const res = tx.objectStore(Stores.notes).get(id);
      res.onsuccess = () => {
        console.log("fetch txn success");
        resolve(res.result);
      };
      res.onerror = (event) => {
        if (res.error?.name === "DataError") {
          console.log(`No note with id:${id} found`);
        }
        reject("Transaction error:" + res.error);
      };
    });
  });
};

export const fetchNoteByPath = (
  file_name: string,
  file_path: string
): Promise<Note> => {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const tx = db.transaction(Stores.notes);

      const index = tx.objectStore(Stores.notes).index("path");
      const res = index.get([file_path, file_name]);

      res.onsuccess = () => {
        console.log("fetchByPath txn success");
        resolve(res.result);
      };
      res.onerror = () => {
        if (res.error?.name === "DataError") {
          console.log(`No note with path:${file_path}\\${file_name} found`);
        }
        reject("Transaction error:" + res.error);
      };
    });
  });
};

export const storeNote = (data: Omit<Note, "id">): Promise<Note> => {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).add(data);
      res.onsuccess = () => {
        resolve({ ...data, id: Number(res.result) });
      };
      res.onerror = () => {
        if (res.error?.name === "ConstraintError") {
          console.error(
            `The given path:${data.file_path}\\${data.file_name} constraint not satisfied`
          );
        }
        reject("Transaction error:" + res.error);
      };
    });
  });
};

export const deleteNote = (id: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).delete(id);
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        if (res.error?.name === "DataError") {
          console.log(`Note with id:${id} not found`);
        }
        reject("Transaction error:" + res.error);
      };
    });
  });
};

export const putNote = (data: PartialBy<Note, "id">): Promise<Note> => {
  return new Promise((resolve, reject) => {
    initDb().then((db) => {
      const tx = db.transaction(Stores.notes, "readwrite");
      const store = tx.objectStore(Stores.notes);
      const res = store.put(data);
      res.onsuccess = () => {
        resolve({ ...data, id: Number(res.result) });
      };
      res.onerror = () => {
        if (res.error?.name === "ConstraintError") {
          console.error(
            `The given id:${data.id} or path:${data.file_path}\\${data.file_name} constraint not satisfied`
          );
        }
        reject(res.error);
      };
    });
  });
};
