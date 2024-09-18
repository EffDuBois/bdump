"use client";

import { useEffect, useState } from "react";
import Spinner from "./loaders/Spinner";
import { fetchNotes, Note, storeNote, Stores } from "@/lib/data";

export default function SideBar() {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = async () => {
    fetchNotes().then((notes) => setNotes(notes));
  };
  const createNote = async () => {
    storeNote({
      path: "/test",
      title: "NewNote",
      content: "",
      vembed: [],
    });
    getNotes();
  };

  useEffect(() => {
    getNotes();
  }, []);
  return (
    <div>
      {notes ? (
        <ul>
          <button onClick={createNote}>Add Note +</button>
          {notes.map((note) => (
            <li key={note.id}>{note.path}</li>
          ))}
        </ul>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
