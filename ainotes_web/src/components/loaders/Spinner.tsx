import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SpinnerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
export default function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={
        "animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" +
        className
      }
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
