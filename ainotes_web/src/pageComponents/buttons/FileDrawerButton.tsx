import SlabButtonOutline, {
  SlabButtonOutlineProps,
} from "@/components/buttons/SlabButtonOutline";
import { FaFolderClosed } from "react-icons/fa6";

import { FC } from "react";

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
      className={"size-12 *:m-auto" + className}
      onClick={drawerOpen}
      {...others}
    >
      <FaFolderClosed />
    </SlabButtonOutline>
  );
};

export default FileDrawerButton;
