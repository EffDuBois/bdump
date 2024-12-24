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
    <div className="text-md">
      {mainText || lightText ? (
        <>
          <CustomMarkdown>{mainText}</CustomMarkdown>
          <br />
          <CustomMarkdown
            className={`${subtextFont.className} ${
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
