"use client";

import { SetStateAction } from "react";
import { Note, NotesDbType } from "@/utils/data";
import Spinner from "../components/loaders/Spinner";
import { getTitleFromPath } from "@/utils/utils";
import { interfaceFont } from "@/ui/fonts";
import { PartialBy } from "@/utils/custom_types";
import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import SlabButtonOutline from "../components/buttons/SlabButtonOutline";
import FileDrawerButton from "./buttons/FileDrawerButton";

interface SideBarProps {
  notes: Note[];
  storeTxnStatus: boolean;
  setCurrentNote: React.Dispatch<
    SetStateAction<PartialBy<Note, "id"> | undefined>
  >;
  createEmptyNote: () => {};
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  deleteNote: NotesDbType["deleteNote"];
}

export default function FileDrawer({
  notes,
  storeTxnStatus,
  setCurrentNote,
  createEmptyNote,
  setDrawerOpen,
  deleteNote,
}: SideBarProps) {
  return (
    <div
      className={`w-full sm:w-1/3 h-screen dark:bg-neutral-900 border-r-[1px] border-neutral-400 ${interfaceFont.className}`}
    >
      <FileDrawerButton drawerOpen={() => setDrawerOpen((cur) => !cur)} />
      <div className="flex flex-col p-6 gap-2">
        <SlabButtonOutline
          className="text-center mb-4"
          onClick={createEmptyNote}
        >
          Add Note
        </SlabButtonOutline>
        {notes && !storeTxnStatus ? (
          notes.map((note) => (
            <SlabButtonWDelete
              key={note.id}
              onClick={() => {
                setCurrentNote(note);
                setDrawerOpen(false);
              }}
              onClickDelete={() => deleteNote(note.id)}
            >
              {note.path ? getTitleFromPath(note.path) : "New Note"}
            </SlabButtonWDelete>
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
