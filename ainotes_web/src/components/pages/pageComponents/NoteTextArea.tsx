import { subtextFont } from "@/ui/fonts";

import PlaceHolderTextArea from "./PlaceHolderTextArea";

import CustomMarkdown from "../../CustomMarkdown";

interface NoteTextAreaProps {
  mainText?: string;
  lightText?: string;
  pulse?: boolean;
}

export default function NoteTextArea({
  mainText,
  lightText,
}: NoteTextAreaProps) {
  return (
    <div className="text-md flex-1 w-full">
      {mainText || lightText ? (
        <>
          <CustomMarkdown>{mainText}</CustomMarkdown>
          <br />
          <CustomMarkdown
            className={`${subtextFont.className} text-xl ${
              false ? " animate-pulse" : ""
            } inline`}
          >
            {lightText}
          </CustomMarkdown>
        </>
      ) : (
        <PlaceHolderTextArea className={false ? "animate-pulse" : ""} />
      )}
    </div>
  );
}
