"use client";

import { SetStateAction } from "react";
import { Note, NotesDbType } from "@/utils/data";
import Spinner from "./loaders/Spinner";
import { getTitleFromPath } from "@/utils/utils";
import SlabButton from "@/components/buttons/SlabButton";
import { interfaceFont } from "@/ui/fonts";
import { PartialBy } from "@/utils/custom_types";
import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import SlabButtonOutline from "../components/buttons/SlabButtonOutline";
import { FaFolderClosed } from "react-icons/fa6";

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
      className={`w-full sm:w-1/3 h-screen dark:bg-neutral-900 border-r-[1px] border-gray-400 ${interfaceFont.className}`}
    >
      <SlabButtonOutline onClick={() => setDrawerOpen((cur) => !cur)}>
        <FaFolderClosed />
      </SlabButtonOutline>
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
              onDeleteClick={() => deleteNote(note.id)}
            >
              {getTitleFromPath(note.path)}
            </SlabButtonWDelete>
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}
