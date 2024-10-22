import SlabButton, { SlabButtonProps } from "@/components/buttons/SlabButton";
import { ButtonHTMLAttributes, DetailedHTMLProps, SetStateAction } from "react";

export type SlabButtonOutlineProps = SlabButtonProps;

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
