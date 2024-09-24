import SlabButton from "@/components/buttons/SlabButton";
import { SetStateAction } from "react";
import { FaFolderClosed } from "react-icons/fa6";

interface DrawerToggleProps {
  className?: string;
  setDrawerOpen: React.Dispatch<SetStateAction<boolean>>;
  disabled?: boolean;
}

export default function DrawerToggle({
  className,
  setDrawerOpen,
  disabled,
}: DrawerToggleProps) {
  return (
    <SlabButton
      className={`self-start border-2 border-gray-400 m-2 ${className}`}
      onClick={() => {
        setDrawerOpen((cur) => !cur);
      }}
      disabled={disabled}
    >
      <FaFolderClosed />
    </SlabButton>
  );
}
