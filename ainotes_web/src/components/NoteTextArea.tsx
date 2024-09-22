import { subtextFont, titleFont } from "@/ui/fonts";
import { Note } from "@/utils/data";
import { getTitle } from "@/utils/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteTextAreaProps {
  currentNote: Note;
  transcript: string;
}

export default function NoteTextArea({
  currentNote,
  transcript,
}: NoteTextAreaProps) {
  return (
    <>
      {currentNote.path ? (
        <h1 className="text-4xl">{getTitle(currentNote)}</h1>
      ) : (
        <h1 className={`${titleFont.className} text-4xl`}>NotesAPP</h1>
      )}

      <div className="h-[50vh] sm:text-2xl text-xl w-full lg:w-2/5">
        {currentNote.content || transcript ? (
          <>
            <Markdown remarkPlugins={[remarkGfm]}>
              {currentNote?.content}
            </Markdown>
            <Markdown
              className={`${subtextFont.className} inline`}
              remarkPlugins={[remarkGfm]}
            >
              {transcript}
            </Markdown>
          </>
        ) : (
          "Placeholder Text"
        )}
      </div>
    </>
  );
}
