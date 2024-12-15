import { recordingType, setTranscriptType } from "@/app/page";
import CircleButton from "@/components/buttons/CircleButton";
import { Note } from "@/services/database/dataModels";
import { CgClose } from "react-icons/cg";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";

interface InputButtonsProps {
  transcript: Note["transcript"];
  setTranscript: setTranscriptType;
  toggleRecording: (type?: recordingType) => void;
  isRecording?: recordingType;
}

export default function InputButtons({
  transcript,
  setTranscript,
  toggleRecording,
  isRecording,
}: InputButtonsProps) {
  return (
    <div className="mb-24 mt-4 sm:mb-2 sm:mt-2 flex justify-center items-center gap-5 relative">
      <CircleButton
        onClick={() => setTranscript("")}
        className={` !size-10 absolute translate-x-[-45px] left-0 top-0 ${
          !transcript ? "hidden" : ""
        }`}
      >
        <CgClose size={"20px"} />
      </CircleButton>
      <CircleButton
        onClick={() => toggleRecording("note")}
        className={isRecording ? "hidden" : ""}
      >
        <FaMicrophone size={"38px"} />
      </CircleButton>
      <CircleButton
        onClick={() => toggleRecording("query")}
        className={isRecording ? "hidden" : ""}
      >
        <IoSparklesSharp size={"38px"} />
      </CircleButton>
      <CircleButton
        onClick={() => toggleRecording()}
        className={!isRecording ? "hidden" : ""}
      >
        <FaStop className="text-red-500" size={"38px"} />
      </CircleButton>
    </div>
  );
}
