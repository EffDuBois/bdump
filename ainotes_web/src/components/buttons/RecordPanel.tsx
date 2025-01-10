import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../ui/button";
import { Mic, Undo2 } from "lucide-react";
import MainActionButton from "./MainActionButton";
import { FaSquare } from "react-icons/fa6";
import { recordingStatusType } from "@/lib/transcriber";
import Spinner from "../loaders/Spinner";

interface RecordPanelType extends ButtonProps {
  onClear: () => void;
  showClearButton: boolean;
  recordingStatus: recordingStatusType;
  recordingTime: string;
}

const RecordPanel = ({
  onClear,
  showClearButton,
  recordingStatus,
  recordingTime,
  className,
  children,
  ...props
}: RecordPanelType) => {
  return (
    <div className="relative">
      <MainActionButton
        onClick={onClear}
        variant={"secondary"}
        className={twMerge(
          `w-20 absolute -translate-x-[5.5rem] left-0 top-0`,
          !showClearButton ? "hidden" : ""
        )}
      >
        <>
          <Undo2 />
          Reset
        </>
      </MainActionButton>
      <Button
        className={twMerge("rounded-full size-16 bottom-5 sticky", className)}
        variant={recordingStatus === "transmitting" ? "destructive" : "default"}
        {...props}
        disabled={
          recordingStatus === "connecting" || recordingStatus === "disconnected"
        }
      >
        {recordingStatus === "transmitting" ? (
          <FaSquare />
        ) : recordingStatus === "connecting" ? (
          <Spinner />
        ) : (
          <Mic />
        )}
      </Button>
      <span
        className={twMerge(
          `absolute top-[50%] translate-y-[-50%] translate-x-2`,
          recordingStatus === "transmitting" ? "" : "hidden"
        )}
      >
        {recordingTime}
      </span>
    </div>
  );
};

export default RecordPanel;
