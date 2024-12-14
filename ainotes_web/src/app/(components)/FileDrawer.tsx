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
import { PartialExcept } from "@/utils/custom_types";

interface SideBarProps {
  setCurrentNote: React.Dispatch<
    SetStateAction<PartialExcept<Note, "transcript">>
  >;
  drawerStateObject: {
    state: boolean;
    setState: React.Dispatch<SetStateAction<boolean>>;
  };
}

export default function FileDrawer({
  setCurrentNote,
  drawerStateObject,
}: SideBarProps) {
  const { notes, notesFetchStatus, storeNote, deleteNote, fetchNoteByPath } =
    useStore();
  const createEmptyNote = async () => {
    const emptyNote = await fetchNoteByPath("", "");
    setCurrentNote(
      emptyNote
        ? emptyNote
        : await storeNote({
            content: "",
            file_name: "",
            file_path: "",
            transcript: "",
          })
    );
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
