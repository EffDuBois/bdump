import SlabButton, { SlabButtonProps } from "./SlabButton";
import { IoCloseOutline } from "react-icons/io5";

interface SlabButtonWDeleteProps extends SlabButtonProps {
  onDeleteClick: () => {};
}

export default function SlabButtonWDelete({
  onDeleteClick,
  className,
  ...others
}: SlabButtonWDeleteProps) {
  return (
    <div className="flex">
      <SlabButton className={`grow rounded-r-none ${className}`} {...others} />
      <SlabButton className="rounded-l-none" onClick={onDeleteClick}>
        <IoCloseOutline />
      </SlabButton>
    </div>
  );
}
