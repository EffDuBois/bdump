import SlabButtonOutline, {
  SlabButtonOutlineProps,
} from "@/components/buttons/SlabButtonOutline";

import { FC } from "react";
import { twMerge } from "tailwind-merge";
import {  Sidebar } from "lucide-react";

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
      className={twMerge("mt-2 ml-2 p-2 *:m-auto", className)}
      onClick={drawerOpen}
      {...others}
    >
      <Sidebar />
    </SlabButtonOutline>
  );
};

export default FileDrawerButton;
