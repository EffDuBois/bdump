import { recordingType } from "@/app/page";
import CircleButton from "@/components/buttons/CircleButton";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";

interface InputButtonsProps {
  toggleRecording: (type?: recordingType) => void;
  isRecording?: recordingType;
}

export default function InputButtons({
  toggleRecording,
  isRecording,
}: InputButtonsProps) {
  return (
    <div className="mb-24 mt-4 sm:mb-2 sm:mt-2 flex justify-center items-center gap-10">
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
