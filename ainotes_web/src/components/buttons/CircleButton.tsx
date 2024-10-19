import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export default function CircleButton({
  children,
  className,
  ...others
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={`p-4 border-2 border-gray-400 rounded-full ${className}`}
      {...others}
    >
      {children}
    </button>
  );
}
