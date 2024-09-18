const version = 1;

export interface Note {
  id: string;
  path: string;
  title: string;
  content: string;
  vembed: Float32Array | never[];
}

export enum DBs {
  notes = "NotesDB",
}

export enum Stores {
  notes = "Notes",
}

export const initNotesDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // open the connection
    const request = indexedDB.open(DBs.notes, version);

    request.onupgradeneeded = () => {
      const db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(Stores.notes)) {
        console.log("Creating users store");
        db.createObjectStore(Stores.notes, {
          keyPath: "path",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const version = db.version;
      console.log("initDB success", version);
      resolve(true);
    };

    request.onerror = (event) => {
      console.error("Database error: ", event);
      reject(false);
    };
  });
};

export const fetchNotes = (): Promise<Note[]> => {
  return new Promise((resolve, reject) => {
    initNotesDB();
    const request = indexedDB.open(DBs.notes);

    request.onsuccess = () => {
      const db = request.result;

      const tx = db.transaction(Stores.notes);

      const res = tx.objectStore(Stores.notes).getAll();
      res.onsuccess = () => {
        console.log("fetch txn success");
        resolve(res.result);
      };
      res.onerror = (event) => {
        console.error("fetch txn error: ", event);
        resolve([]);
      };
    };
    request.onerror = (event) => {
      console.error("Database error:", event);
    };
  });
};

export const storeNote = (data: Omit<Note, "id">): Promise<boolean | string> => {
  return new Promise((resolve, reject) => {
    initNotesDB();
    const request = indexedDB.open(DBs.notes);

    request.onsuccess = () => {
      const db = request.result;

      const tx = db.transaction(Stores.notes, "readwrite");
      const res = tx.objectStore(Stores.notes).add(data);
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = (event) => {
        console.error("add txn error:", event);
      };
    };
    request.onerror = (event) => {
      console.error("Database error:", event);
    };
  });
};
