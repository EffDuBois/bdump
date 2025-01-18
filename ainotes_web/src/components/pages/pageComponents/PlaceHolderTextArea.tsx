import { maintextFont, titleFont } from "@/ui/fonts";
import { Mic, Search, Sparkle, Sparkles } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface PlaceHolderTextAreaProps {
  className?: string;
}

const PlaceHolderTextArea: React.FC<PlaceHolderTextAreaProps> = ({
  className,
}) => {
  return (
    <ul
      className={twMerge(
        "space-y-3 text-xl font-light list-disc",
        maintextFont.className,
        className
      )}
    >
      <li>
        <b className="font-bold text-2xl">Create</b> notes using your voice
      </li>
      <li>
        Press the ask button to <b className="font-bold text-2xl">Ask</b>{" "}
        anything from your notes
      </li>
      <li>
        You can record notes, create lists, record a meeting or just speak your
        thoughts out
      </li>
      <li>
        Notes are stored <b className="font-bold text-2xl">Locally </b> on your
        phone, so you can access them anytime
      </li>
      <li>Download the Web-App for a seamless experience</li>
      <br />
    </ul>
  );
};

export default PlaceHolderTextArea;
