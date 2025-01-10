import { twMerge } from "tailwind-merge";
import { Button, ButtonProps } from "../ui/button";
import { Mic, Undo2 } from "lucide-react";
import { Card } from "../ui/card";
import MainActionButton from "./MainActionButton";

interface RecordPanelType extends ButtonProps {
  onClear: () => void;
  showClearButton: boolean;
}

const RecordPanel = ({
  onClear,
  showClearButton,
  className,
  children,
  ...props
}: RecordPanelType) => {
  return (
    <div>
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
        {...props}
      >
        <Mic />
      </Button>
    </div>
  );
};

export default RecordPanel;
