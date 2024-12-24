import { useStore } from "@/services/store/provider";
import { createRef, FocusEvent, useEffect, useRef, useState } from "react";
import NoteTitleArea from "./pageComponents/NoteTitleArea";
import NoteTextArea from "./pageComponents/NoteTextArea";

const CreatePage = () => {
  const store = useStore();
  const currentNote = store.currentNote;

  const [title, setTitle] = useState<string>();

  useEffect(() => {
    setTitle(currentNote?.file_name || "");
  }, [currentNote?.file_name]);

  const setTempTitle = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    setTitle(e.target.value);
  };

  return (
    <>
      <NoteTitleArea
        value={title}
        onChange={setTempTitle}
        onBlur={() => {
          if (title && title !== "") store.updateTitle(title);
        }}
      />
      <NoteTextArea
        lightText={currentNote?.transcript}
        mainText={currentNote?.content}
      />
    </>
  );
};

export default CreatePage;
