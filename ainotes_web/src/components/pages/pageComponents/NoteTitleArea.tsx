"use client";
import { maintextFont } from "@/ui/fonts";
import { forwardRef, TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const NoteTitleArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ value, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={twMerge(
        "text-4xl mb-8 w-full h-fit block bg-inherit focus:outline-none resize-none overflow-hidden",
        value ? "" : maintextFont.className
      )}
      placeholder="Untitled"
      rows={1}
      {...props}
    />
  );
});

NoteTitleArea.displayName = "NoteTitleArea";

export default NoteTitleArea;
