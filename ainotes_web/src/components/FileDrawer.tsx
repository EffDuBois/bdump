"use client";

import { useEffect, useState } from "react";
import { Note, NotesDbType } from "@/utils/data";
import Spinner from "./loaders/Spinner";

interface SideBarProps {
  notes: Note[];
  notesDb: NotesDbType;
  createEmptyNote: () => {};
}

export default function FileDrawer({
  notes,
  notesDb,
  createEmptyNote,
}: SideBarProps) {
  return (
    <ul>
      <button onClick={createEmptyNote}>Add Note +</button>
      {notes && !notesDb.storeTxnStatus ? (
        notes.map((note) => <li key={note.path}>{note.path}</li>)
      ) : (
        <Spinner />
      )}
    </ul>
  );
}
