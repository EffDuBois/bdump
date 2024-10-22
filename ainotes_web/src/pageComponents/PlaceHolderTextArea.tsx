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
      Dump all your notes & thoughts just using voice here
      <br />
      <br />
      Press the <FaMicrophone className="size-4 inline" size={"64px"} /> button
      to start recording
      <br />
      Ask anything from your notes using the{" "}
      <IoSparklesSharp className="size-4 inline" size={"64px"} /> Button
    </div>
  );
};

export default PlaceHolderTextArea;
