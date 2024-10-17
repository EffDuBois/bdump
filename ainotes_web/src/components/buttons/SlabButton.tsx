import { ReactNode } from "react";

export interface SlabButtonProps {
  className?: string;
  onClick?: (event: any) => any;
  children?: ReactNode;
  disabled?: boolean;
}
export default function SlabButton({
  className,
  onClick,
  children,
  disabled,
}: SlabButtonProps) {
  return (
    <button
      className={`hover:bg-gray-600/25 py-2 px-4 rounded-lg text-left ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
