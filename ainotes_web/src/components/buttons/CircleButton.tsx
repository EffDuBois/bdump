import { ReactNode } from "react";

interface SlabButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: (event: any) => any;
  key?: any;
  disabled: boolean;
}
export default function CircleButton({
  children,
  className,
  onClick,
  key,
  disabled,
}: SlabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 border-2 border-gray-400 rounded-full ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
