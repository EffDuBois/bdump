import { twMerge } from "tailwind-merge";
import SlabButton, { SlabButtonProps } from "./SlabButton";
import { IoCloseOutline } from "react-icons/io5";
import { Button } from "../ui/button";

interface SlabButtonWDeleteProps extends SlabButtonProps {
  onClickDelete: () => void;
}

export default function SlabButtonWDelete({
  onClickDelete,
  className,
  ...others
}: SlabButtonWDeleteProps) {
  return (
    <div className="flex rounded-lg">
      <Button
        variant={"ghost"}
        className={twMerge(
          `grow px-5 rounded-r-none text-left text-nowrap text-clip overflow-hidden`,
          className
        )}
        {...others}
      />
      <Button
        variant={"ghost"}
        className={twMerge("rounded-l-none", className)}
        onClick={onClickDelete}
      >
        <IoCloseOutline />
      </Button>
    </div>
  );
}
