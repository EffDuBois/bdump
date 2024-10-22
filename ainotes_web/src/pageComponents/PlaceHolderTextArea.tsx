import { subtextFont } from "@/ui/fonts";
import React from "react";
import { FaMicrophone } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";

interface PlaceHolderTextAreaProps {
  isRecording: boolean;
}

const PlaceHolderTextArea: React.FC<PlaceHolderTextAreaProps> = ({
  isRecording,
}) => {
  return (
    <div className={`${isRecording && "animate-pulse"}`}>
      <p>
        Dump all your notes & thoughts just using voice here
        <br />
        This can-
      </p>
      <ol className="list-disc">
        <li>Format notes</li>
        <li>Make summaries</li>
        <li>Take down ToDo lists</li>
        <li className={subtextFont.className}>
          <s>Make Chicken Noodles</s>
        </li>
      </ol>
      <br />
      Press the {" "}<FaMicrophone className="size-4 inline" size={"64px"} />{" "}
      button to start recording
      <br />
      Ask anything from your notes using the{" "}
      <IoSparklesSharp className="size-4 inline" size={"64px"} />{" "}
    </div>
  );
};

export default PlaceHolderTextArea;
