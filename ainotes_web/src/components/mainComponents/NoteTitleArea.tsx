"use client";
import { titleFont } from "@/ui/fonts";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const NoteTitleArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ defaultValue, value, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      defaultValue={defaultValue}
      className={twMerge(
        "text-4xl mb-8 w-full h-fit block bg-inherit focus:outline-none resize-none overflow-hidden",
        value ? "" : titleFont.className
      )}
      placeholder="BrainDump"
      rows={1}
      {...props}
    />
  );
});

NoteTitleArea.displayName = "NoteTitleArea";

export default NoteTitleArea;
