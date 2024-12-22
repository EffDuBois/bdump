import { FaMicrophone } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

interface PlaceHolderTextAreaProps {
  className?: string;
}

const PlaceHolderTextArea: React.FC<PlaceHolderTextAreaProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      Dump all your notes & thoughts just using voice
      <br />
      <br />
      Press the <FaMicrophone className="size-6 inline" size={"64px"} /> button
      to start recording
      <br />
      Ask anything from your notes using the{" "}
      <IoSparklesSharp className="size-6 inline" size={"64px"} /> Button
    </div>
  );
};

export default PlaceHolderTextArea;
