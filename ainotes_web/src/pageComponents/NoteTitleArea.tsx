import { titleFont } from "@/ui/fonts";
import { Note } from "@/utils/data";
import { getTitleFromPath } from "@/utils/utils";
import { useEffect, useState } from "react";

interface NoteTitleAreaProps {
  updateTitle: (newTitle: string) => void;
  noteTitle: string | undefined;
}

export default function NoteTitleArea({
  updateTitle,
  noteTitle,
}: NoteTitleAreaProps) {
  const [title, setTitle] = useState(noteTitle);
  useEffect(() => {
    setTitle(noteTitle);
  }, [noteTitle]);
  return (
    <>
      <h1 className="text-4xl mt-4 mb-8 text-center">
        {noteTitle ? (
          <input
            className="bg-inherit border-none active:border-none"
            type="text"
            onBlur={(e) => {
              if (e.target.value !== noteTitle && title) {
                updateTitle(title);
              }
            }}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        ) : (
          <span className={`${titleFont.className}`}>NotesAPP</span>
        )}
      </h1>
    </>
  );
}
