import { subtextFont, titleFont } from "@/ui/fonts";
import { Note } from "@/utils/data";
import { getTitleFromPath } from "@/utils/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteTextAreaProps {
  currentNote: Note;
  transcript: string;
  isRecording: boolean;
}

export default function NoteTextArea({
  currentNote,
  transcript,
  isRecording,
}: NoteTextAreaProps) {
  return (
    <>
      <div className="sm:text-2xl h-full text-xl w-full overflow-y-auto px-[20%]">
        {currentNote.content || currentNote.path || transcript ? (
          <>
            <Markdown remarkPlugins={[remarkGfm]}>
              {currentNote?.content}
            </Markdown>
            <Markdown
              className={`${subtextFont.className} ${
                !isRecording && "animate-pulse"
              } inline`}
              remarkPlugins={[remarkGfm]}
            >
              {transcript}
            </Markdown>
          </>
        ) : (
          <div className={`${isRecording && "animate-pulse"}`}>
            <p>
              Hey I am your{" "}
              <span className={titleFont.className}>NoteTaker</span> assistant,
              I will help take your notes for you-
              <br />I can-
            </p>
            <ol className="list-disc">
              <li>Format your notes for you</li>
              <li>Make summaries for you</li>
              <li>Take down lists for you</li>
              <li>Lookup things from your notes</li>
              <li className={subtextFont.className}>
                <s>Make Chicken Noodles for you</s>
              </li>
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
