"use client";
import { Note } from "@/services/database/dataModels";
import { useStore } from "@/services/store/storeProvider";
import { titleFont } from "@/ui/fonts";
import { PartialExcept } from "@/utils/custom_types";
import { ChangeEvent, SetStateAction } from "react";

interface NoteTitleAreaProps {
  currentNote: PartialExcept<Note, "transcript">;
  setCurrentNote: React.Dispatch<
    SetStateAction<PartialExcept<Note, "transcript">>
  >;
}

export default function NoteTitleArea({
  currentNote,
  setCurrentNote,
}: NoteTitleAreaProps) {
  const { putNote } = useStore();
  const updateTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentNote((prev) => {
      return { file_name: e.target.value, ...prev };
    });
  };
  const saveTitle = async (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (currentNote?.file_name) {
        const newNote = await putNote({
          ...currentNote,
          file_name: currentNote.file_name,
        });
        setCurrentNote(newNote);
      }
    };
  return (
    <h1 className="text-4xl mb-8 text-center">
      {currentNote?.file_name ? (
        <textarea
          className="w-full bg-inherit border-none active:border-none resize-none overflow-hidden"
          onBlur={saveTitle}
          onChange={updateTitle}
          value={currentNote?.file_name}
        />
      ) : (
        <span className={`${titleFont.className}`}>BrainDump</span>
      )}
    </h1>
  );
}
