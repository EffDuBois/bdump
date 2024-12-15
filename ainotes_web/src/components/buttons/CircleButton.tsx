import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export default function CircleButton({
  className,
  ...others
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={`size-16 border-2 border-black *:m-auto dark:border-neutral-400 rounded-full disabled:dark:border-neutral-700 disabled:border-neutral-400 ${className}`}
      {...others}
    />
  );
}
