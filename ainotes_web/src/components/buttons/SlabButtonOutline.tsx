import SlabButton from "@/components/buttons/SlabButton";
import { ButtonHTMLAttributes, DetailedHTMLProps, SetStateAction } from "react";
import { FaFolderClosed } from "react-icons/fa6";

interface SlabButtonOutlineProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
}

export default function SlabButtonOutline({
  className,
  ...others
}: SlabButtonOutlineProps) {
  return (
    <SlabButton
      className={`border-[1px] border-black dark:border-gray-400 m-2 ${className}`}
      {...others}
    />
  );
}
