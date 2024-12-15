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
    <div className="flex">
      <SlabButton className={`grow rounded-r-none ${className}`} {...others} />
      <SlabButton
        className={`rounded-l-none ${className}`}
        onClick={onClickDelete}
      >
        <IoCloseOutline />
      </SlabButton>
    </div>
  );
}
