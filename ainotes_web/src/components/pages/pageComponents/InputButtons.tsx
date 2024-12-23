import { modeType } from "@/app/page";
import MainActionButton from "@/components/buttons/MainActionButton";
import { Card } from "@/components/ui/card";
import { Plus, Search, Square, SquareIcon, Undo2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

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
    <Card className="rounded-2xl p-2 bg-sidebar flex justify-center items-center gap-3 relative">
      <MainActionButton
        onClick={clearLightText}
        variant={"secondary"}
        className={twMerge(
          `w-20 absolute -translate-x-[5.5rem] left-0 top-0`,
          !showUndo ? "hidden" : ""
        )}
      >
        <>
          <Undo2 />
          Reset
        </>
      </MainActionButton>
      <MainActionButton
        onClick={onCreate}
        variant={isRecording ? "destructive" : "default"}
        className={isRecording && mode !== "CREATE" ? "hidden" : ""}
        disabled={disabled}
      >
        {!isRecording ? (
          <>
            <Plus /> Create
          </>
        ) : (
          <>
            {" "}
            <Square size={"38px"} />
            Stop
          </>
        )}
      </MainActionButton>
      <MainActionButton
        onClick={onAsk}
        className={isRecording && mode !== "ASK" ? "hidden" : ""}
        disabled={disabled}
      >
        {!isRecording ? (
          <>
            <Search />
            Ask
          </>
        ) : (
          <>
            {" "}
            <Square className="text-red-500" size={"38px"} />
            Stop
          </>
        )}
      </MainActionButton>
    </Card>
  );
}
