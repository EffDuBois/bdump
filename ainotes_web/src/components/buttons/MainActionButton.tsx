import { Button, ButtonProps } from "../ui/button";
import { twMerge } from "tailwind-merge";

export default function MainActionButton({
  className,
  ...others
}: ButtonProps) {
  return (
    <Button
      className={twMerge(`w-28 rounded-2xl`, className)}
      {...others}
    />
  );
}
  