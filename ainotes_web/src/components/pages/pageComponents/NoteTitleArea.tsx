"use client";
import { maintextFont } from "@/ui/fonts";
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const NoteTitleArea = forwardRef<
HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={twMerge(
        `text-4xl mb-8 w-full h-fit block bg-inherit focus:outline-none resize-none overflow-hidden ${maintextFont.className}`,
        className
      )}
      {...props}
    />
  );
});

NoteTitleArea.displayName = "NoteTitleArea";

export default NoteTitleArea;
