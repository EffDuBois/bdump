import { subtextFont } from "@/ui/fonts";

import CustomMarkdown from "../../CustomMarkdown";

interface NoteTextAreaProps {
  mainText?: string;
  lightText?: string;
  pulse?: boolean;
}

export default function NoteTextArea({
  mainText,
  lightText,
  pulse,
}: NoteTextAreaProps) {
  return (
    <div className="text-md flex-1 w-full">
      <>
        <CustomMarkdown>{mainText}</CustomMarkdown>
        <br />
        <CustomMarkdown
          className={`${subtextFont.className} text-xl ${
            pulse ? " animate-pulse" : ""
          } inline`}
        >
          {lightText}
        </CustomMarkdown>
      </>
    </div>
  );
}
