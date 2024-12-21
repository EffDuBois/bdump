"use client";

import { SetStateAction } from "react";

import Spinner from "../../components/loaders/Spinner";

import { interfaceFont } from "@/ui/fonts";

import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import SlabButtonOutline from "../../components/buttons/SlabButtonOutline";
import FileDrawerButton from "./buttons/FileDrawerButton";
import { useStore } from "@/services/store/provider";
import { Note } from "@/services/database/dataModels";
import { PartialExcept } from "@/utils/custom_types";
import useStoreActions from "@/services/store/actions";
import { useDb } from "@/services/database/dbProvider";

interface SideBarProps {
  currentNote: PartialExcept<Note, "transcript">;
  setCurrentNote: React.Dispatch<
    SetStateAction<PartialExcept<Note, "transcript">>
  >;
  drawerStateObject: {
    state: boolean;
    setState: React.Dispatch<SetStateAction<boolean>>;
  };
}

export default function FileDrawer({
  currentNote,
  setCurrentNote,
  drawerStateObject,
}: SideBarProps) {
  const { notes, notesFetchStatus } = useStore();
  const db = useDb();

  const addEmptyNote = async () => {
    getEmptyNote().then((note) => {
      if (note) setCurrentNote(note);
    });
  };

  const deleteSelectedNote;
  return (
    <div
      className={
        drawerStateObject.state
          ? `w-full md:w-1/4 h-screen absolute md:relative dark:bg-neutral-900 border-r-[1px] border-neutral-400 ${interfaceFont.className} transition-transform`
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
            onClick={addEmptyNote}
          >
            Add Note
          </SlabButtonOutline>
          {notes && !notesFetchStatus ? (
            notes.map((note) => (
              <SlabButtonWDelete
                className={note.id == currentNote.id ? "bg-neutral-700" : ""}
                key={note.id}
                onClick={() => {
                  if (currentNote.id !== note.id) {
                    setCurrentNote(note);
                    drawerStateObject.setState(false);
                  }
                }}
                onClickDelete={deleteNote}
              >
                {note.file_name ? note.file_name : "New Note"}
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
