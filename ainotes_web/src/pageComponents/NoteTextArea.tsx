import { subtextFont, titleFont } from "@/ui/fonts";
import { Note } from "@/utils/data";
import { getTitleFromPath } from "@/utils/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PlaceHolderTextArea from "./PlaceHolderTextArea";
import { recordingType } from "@/app/page";

interface NoteTextAreaProps {
  noteContent?: string;
  transcript: string;
  isRecording?: recordingType;
}

export default function NoteTextArea({
  noteContent,
  transcript,
  isRecording,
}: NoteTextAreaProps) {
  return (
    <>
      <div className="w-full text-xl">
        {noteContent || transcript ? (
          <>
            <Markdown className="text-wrap" remarkPlugins={[remarkGfm]}>
              {noteContent}
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
          <PlaceHolderTextArea isRecording={isRecording} />
        )}
      </div>
    </>
  );
}
