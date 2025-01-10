import { Loader2 } from "lucide-react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SpinnerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}
export default function Spinner({ className }: SpinnerProps) {
  return <Loader2 className="animate-spin" />;
}
