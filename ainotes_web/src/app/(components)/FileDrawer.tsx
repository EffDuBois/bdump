"use client";

import { SetStateAction } from "react";

import Spinner from "../../components/loaders/Spinner";

import { getTitleFromPath } from "@/utils/utils";
import { interfaceFont } from "@/ui/fonts";

import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import SlabButtonOutline from "../../components/buttons/SlabButtonOutline";
import FileDrawerButton from "./buttons/FileDrawerButton";
import { useStore } from "@/services/store/storeProvider";
import { Note } from "@/services/database/dataModels";

interface SideBarProps {
  setCurrentNote: React.Dispatch<SetStateAction<Partial<Note> | undefined>>;
  drawerStateObject: {
    state: boolean;
    setState: React.Dispatch<SetStateAction<boolean>>;
  };
}

export default function FileDrawer({
  setCurrentNote,
  drawerStateObject,
}: SideBarProps) {
  const { notes, notesFetchStatus, storeNote, deleteNote } = useStore();
  const createEmptyNote = async () => {
    storeNote({ content: "", file_name: "", path: "" });
  };
  return (
    <div
      className={
        drawerStateObject.state
          ? `w-full sm:w-1/3 h-screen dark:bg-neutral-900 border-r-[1px] border-neutral-400 ${interfaceFont.className}`
          : undefined
      }
    >
      <FileDrawerButton
        drawerOpen={() => drawerStateObject.setState((cur) => !cur)}
      />
      {drawerStateObject.state && (
        <div className="flex flex-col p-6 gap-2">
          <SlabButtonOutline
            className="text-center mb-4"
            onClick={createEmptyNote}
          >
            Add Note
          </SlabButtonOutline>
          {notes && !notesFetchStatus ? (
            notes.map((note) => (
              <SlabButtonWDelete
                key={note.id}
                onClick={() => {
                  setCurrentNote(note);
                  drawerStateObject.setState(false);
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
