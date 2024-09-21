"use client";

import { useEffect, useState } from "react";
import Spinner from "./loaders/Spinner";
import { Note, NotesDbType } from "@/utils/data";

interface SideBarProps {
  notesDb: NotesDbType;
}

export default function SideBar({ notesDb }: SideBarProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = async () => {
    notesDb.fetchAllNotes().then((notes) => setNotes(notes));
  };
  const createNote = async () => {
    notesDb.storeNote({
      path: "/Untitled",
      content: "",
      vembed: [],
    });
  };

  useEffect(() => {
    if (!notesDb.storeTxnStatus) {
      getNotes();
    }
  }, [notesDb.storeTxnStatus]);
  return (
    <ul>
      <button onClick={createNote}>Add Note +</button>
      {notes && !notesDb.storeTxnStatus ? (
        notes.map((note) => <li key={note.path}>{note.path}</li>)
      ) : (
        <Spinner />
      )}
    </ul>
  );
}
