import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export type SlabButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export default function SlabButton({ className, ...others }: SlabButtonProps) {
  return (
    <button
      className={`hover:bg-gray-600/25 py-2 px-4 rounded-lg text-left ${className}`}
      {...others}
    />
  );
}
