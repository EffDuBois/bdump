import { Mic, Search, Sparkle, Sparkles } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface PlaceHolderTextAreaProps {
  className?: string;
}

const PlaceHolderTextArea: React.FC<PlaceHolderTextAreaProps> = ({
  className,
}) => {
  return (
    <p className={twMerge("leading-8", className)}>
      Dump all your notes & thoughts just using voice
      <br />
      <Mic className="inline" size={15} /> Use your voice to take notes, make
      to-do lists <br />
      <Sparkles className="inline" size={15} /> You can even summarize your
      meetings and convos<br />
      <Search className="inline" size={15} /> Then you can ask about anything from your notes
    </p>
  );
};

export default PlaceHolderTextArea;
