"use client";

import { SetStateAction } from "react";
import { Note, NotesDbType } from "@/services/data";

import Spinner from "../../components/loaders/Spinner";

import { getTitleFromPath } from "@/utils/utils";
import { interfaceFont } from "@/ui/fonts";
import { PartialBy } from "@/utils/custom_types";

import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import SlabButtonOutline from "../../components/buttons/SlabButtonOutline";
import FileDrawerButton from "./buttons/FileDrawerButton";

interface SideBarProps {
  notes: Note[];
  storeTxnStatus: boolean;
  setCurrentNote: React.Dispatch<
    SetStateAction<PartialBy<Note, "id"> | undefined>
  >;
  createEmptyNote: () => {};
  drawerUseState: {
    state: boolean;
    setState: React.Dispatch<SetStateAction<boolean>>;
  };
  deleteNote: NotesDbType["deleteNote"];
}

export default function FileDrawer({
  notes,
  storeTxnStatus,
  setCurrentNote,
  createEmptyNote,
  drawerUseState,
  deleteNote,
}: SideBarProps) {
  return (
    <div
      className={
        drawerUseState.state
          ? `w-full sm:w-1/3 h-screen dark:bg-neutral-900 border-r-[1px] border-neutral-400 ${interfaceFont.className}`
          : undefined
      }
    >
      <FileDrawerButton
        drawerOpen={() => drawerUseState.setState((cur) => !cur)}
      />
      {drawerUseState.state && (
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
                  drawerUseState.setState(false);
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
      )}
    </div>
  );
}
