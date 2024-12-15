import { twMerge } from "tailwind-merge";
import SlabButton, { SlabButtonProps } from "./SlabButton";
import { IoCloseOutline } from "react-icons/io5";

interface SlabButtonWDeleteProps extends SlabButtonProps {
  onClickDelete: () => {};
}

export default function SlabButtonWDelete({
  onClickDelete,
  className,
  ...others
}: SlabButtonWDeleteProps) {
  return (
    <div className="flex rounded-lg hover:bg-neutral-500">
      <SlabButton
        className={twMerge(`grow rounded-r-none`, className)}
        {...others}
      />
      <SlabButton
        className={twMerge("rounded-l-none hover:bg-neutral-50/25", className)}
        onClick={onClickDelete}
      >
        <IoCloseOutline />
      </SlabButton>
    </div>
  );
}
