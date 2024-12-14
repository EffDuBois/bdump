"use client";
import { Note } from "@/services/database/dataModels";
import { useStore } from "@/services/store/provider";
import { titleFont } from "@/ui/fonts";
import { ChangeEvent, SetStateAction } from "react";

interface NoteTitleAreaProps {
  currentNote: Partial<Note> | undefined;
  setCurrentNote: React.Dispatch<SetStateAction<Partial<Note | undefined>>>;
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
        path: currentNote.path || "",
        content: currentNote.content || "",
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
