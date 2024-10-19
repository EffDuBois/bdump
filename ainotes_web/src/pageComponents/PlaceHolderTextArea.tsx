import CircleButton from "@/components/buttons/CircleButton";
import { subtextFont, titleFont } from "@/ui/fonts";
import React from "react";
import { FaMicrophone, FaStop } from "react-icons/fa6";
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
      Press the{" "}
      <CircleButton className="border-[1px] p-1" disabled>
        <FaMicrophone className="size-4" size={"64px"} />
      </CircleButton>{" "}
      button to start recording
      <br />
      Ask anything from your notes using the {" "}
      <CircleButton className="border-[1px] p-1" disabled>
        <IoSparklesSharp className="size-4" size={"64px"} />
      </CircleButton>{" "} button
    </div>
  );
};

export default PlaceHolderTextArea;
