import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export interface SlabButtonProps {
  className?: string;
  onClick?: (event: any) => any;
  children?: ReactNode;
  disabled?: boolean;
}
export default function SlabButton({
  className,
  ...others
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={`hover:bg-gray-600/25 py-2 px-4 rounded-lg text-left ${className}`}
      {...others}
    />
  );
}
