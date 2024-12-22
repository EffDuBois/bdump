import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { Button } from "../ui/button";

export default function CircleButton({
  className,
  ...others
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <Button
      variant={"outline"}
      className={`size-16 border-2 rounded-full ${className}`}
      {...others}
    />
  );
}
