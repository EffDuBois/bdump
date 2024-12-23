import { modeType } from "@/app/page";
import CircleButton from "@/components/buttons/CircleButton";
import { useStore } from "@/services/store/provider";
import { Mic, Search, Square, SquareIcon, Undo2 } from "lucide-react";

interface InputButtonsProps {
  showUndo: boolean;
  disabled: boolean;
  isRecording: boolean;
  mode: modeType;
  clearLightText: () => void;
  onCreate: () => void;
  onAsk: () => void;
}

export default function InputButtons({
  showUndo,
  disabled,
  isRecording,
  mode,
  clearLightText,
  onCreate,
  onAsk,
}: InputButtonsProps) {
  return (
    <div className=" flex justify-center items-center gap-3 relative">
      <CircleButton
        onClick={clearLightText}
        className={` !size-10 absolute translate-x-[-45px] left-0 top-0 ${
          !showUndo ? "hidden" : ""
        }`}
      >
        <Undo2 />
      </CircleButton>
      <CircleButton
        onClick={onCreate}
        className={isRecording && mode !== "CREATE" ? "hidden" : ""}
        disabled={disabled}
      >
        {!isRecording ? (
          <Mic />
        ) : (
          <Square className="text-red-500" size={"38px"} />
        )}
      </CircleButton>
      <CircleButton
        onClick={onAsk}
        className={isRecording && mode !== "ASK" ? "hidden" : ""}
        disabled={disabled}
      >
        {!isRecording ? (
          <Search />
        ) : (
          <Square className="text-red-500" size={"38px"} />
        )}
      </CircleButton>
    </div>
  );
}
