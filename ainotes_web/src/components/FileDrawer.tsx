"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Note, NotesDbType } from "@/utils/data";
import Spinner from "./loaders/Spinner";

interface SideBarProps {
  notes: Note[];
  storeTxnStatus: boolean;
  setCurrentNote: React.Dispatch<SetStateAction<Note>>;
  createEmptyNote: () => {};
}

export default function FileDrawer({
  notes,
  storeTxnStatus,
  setCurrentNote,
  createEmptyNote,
}: SideBarProps) {
  return (
    <div className="w-1/5 border-r-2 border-white p-6 resize-x">
      <button onClick={createEmptyNote}>Add Note +</button>
      {notes && !storeTxnStatus ? (
        notes.map((note) => (
          <button key={note.path} onClick={() => setCurrentNote(note)}>
            {note.path}
          </button>
        ))
      ) : (
        <Spinner />
      )}
    </div>
  );
}
