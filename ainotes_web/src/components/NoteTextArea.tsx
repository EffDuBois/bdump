import { subtextFont, titleFont } from "@/ui/fonts";
import { Note } from "@/utils/data";
import { getTitle } from "@/utils/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteTextAreaProps {
  currentNote: Note;
  transcript: string;
  isRecording: boolean
}

export default function NoteTextArea({
  currentNote,
  transcript,
  isRecording,
}: NoteTextAreaProps) {
  return (
    <>
      <h1 className="text-4xl my-8 text-center">
        {currentNote.path ? (
          getTitle(currentNote)
        ) : (
          <span className={`${titleFont.className}`}>
            NotesAPP
          </span>
        )}
      </h1>

      <div className="sm:text-2xl h-full text-xl w-full overflow-y-auto px-[10%]">
        {currentNote.content || transcript ? (
          <>
            <Markdown remarkPlugins={[remarkGfm]}>
              {currentNote?.content}
            </Markdown>
            <Markdown
              className={`${subtextFont.className} ${!isRecording&&"animate-pulse"} inline`}
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
