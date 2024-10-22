import CircleButton from "@/components/buttons/CircleButton";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";

interface InputButtonsProps {
  toggleNoteRecording: () => {};
  toggleQueryRecording: () => {};
  isRecordingNote: boolean;
  isRecordingQuery: boolean;
  connected: boolean;
}

export default function InputButtons({
  toggleNoteRecording,
  toggleQueryRecording,
  isRecordingNote,
  isRecordingQuery,
  connected,
}: InputButtonsProps) {
  return (
    <div className="w-full mb-24 mt-4 sm:mb-8 sm:mt-8 flex justify-center items-center gap-10">
      <CircleButton
        onClick={toggleNoteRecording}
        disabled={!connected}
        className={isRecordingQuery ? "hidden" : ""}
      >
        {isRecordingNote ? (
          <FaStop className="text-red" size={"38px"} />
        ) : (
          <FaMicrophone size={"38px"} />
        )}
      </CircleButton>
      <CircleButton
        onClick={toggleQueryRecording}
        disabled={!connected}
        className={isRecordingNote ? "hidden" : ""}
      >
        {isRecordingQuery ? (
          <FaStop className="text-red" size={"38px"} />
        ) : (
          <IoSparklesSharp size={"38px"} />
        )}
      </CircleButton>
    </div>
  );
}
