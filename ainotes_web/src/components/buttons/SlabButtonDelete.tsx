import { twMerge } from "tailwind-merge";
import { IoCloseOutline } from "react-icons/io5";
import { Button, ButtonProps } from "../ui/button";

interface SlabButtonWDeleteProps extends ButtonProps {
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
        className={twMerge(`grow rounded-r-none justify-start`, className)}
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
