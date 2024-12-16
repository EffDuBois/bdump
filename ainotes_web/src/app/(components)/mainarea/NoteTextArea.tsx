import { subtextFont } from "@/ui/fonts";

import PlaceHolderTextArea from "./PlaceHolderTextArea";

import { recordingType } from "@/app/page";
import CustomMarkdown from "../CustomMarkdown";
import useStoreActions from "@/services/store/useStoreActions";

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
  const store = useStoreActions();
  return (
    <div className="text-l">
      {noteContent || transcript ? (
        <>
          <CustomMarkdown>{noteContent}</CustomMarkdown>
          <CustomMarkdown
            className={`${subtextFont.className} ${
              (store.storeActionStatus) && " animate-pulse"
            } inline`}
          >
            {transcript}
          </CustomMarkdown>
        </>
      ) : (
        <PlaceHolderTextArea isRecording={isRecording} />
      )}
    </div>
  );
}
