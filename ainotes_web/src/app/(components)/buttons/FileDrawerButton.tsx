import SlabButtonOutline, {
  SlabButtonOutlineProps,
} from "@/components/buttons/SlabButtonOutline";
import { FaFolderClosed } from "react-icons/fa6";

import { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface FileDrawerButtonProps extends SlabButtonOutlineProps {
  drawerOpen: () => void;
}

const FileDrawerButton: FC<FileDrawerButtonProps> = ({
  className,
  drawerOpen,
  ...others
}) => {
  return (
    <SlabButtonOutline
      className={twMerge("mt-2 ml-2 size-12 *:m-auto", className)}
      onClick={drawerOpen}
      {...others}
    >
      <FaFolderClosed />
    </SlabButtonOutline>
  );
};

export default FileDrawerButton;
