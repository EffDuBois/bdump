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
  const { apiStatus } = useStore();
  return (
    <div className="text-md flex-1 w-full">
      {mainText || lightText ? (
        <>
          <CustomMarkdown>{mainText}</CustomMarkdown>
          <br />
          <CustomMarkdown
            className={`${subtextFont.className} text-xl ${
              apiStatus ? " animate-pulse" : ""
            } inline`}
          >
            {lightText}
          </CustomMarkdown>
        </>
      ) : (
        <PlaceHolderTextArea className={apiStatus ? "animate-pulse" : ""} />
      )}
    </div>
  );
}
