import { subtextFont } from "@/ui/fonts";

import PlaceHolderTextArea from "./PlaceHolderTextArea";

import CustomMarkdown from "../../CustomMarkdown";
import { useStore } from "@/services/store/provider";

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
    <div className="text-md">
      {mainText || lightText ? (
        <>
          <CustomMarkdown>{mainText}</CustomMarkdown>
          <br />
          <CustomMarkdown
            className={`${subtextFont.className} ${
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
