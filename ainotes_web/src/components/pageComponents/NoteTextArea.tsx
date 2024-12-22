import { subtextFont } from "@/ui/fonts";

import PlaceHolderTextArea from "./PlaceHolderTextArea";

import CustomMarkdown from "../CustomMarkdown";
import useStoreActions from "@/services/store/actions";

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
  const store = useStoreActions();
  return (
    <div className="text-md">
      {mainText || lightText ? (
        <>
          <CustomMarkdown>{mainText}</CustomMarkdown>
          <br />
          <CustomMarkdown
            className={`${subtextFont.className} ${
              store.storeActionStatus && " animate-pulse"
            } inline`}
          >
            {lightText}
          </CustomMarkdown>
        </>
      ) : (
        <PlaceHolderTextArea className={pulse ? "animate-pulse" : ""} />
      )}
    </div>
  );
}
