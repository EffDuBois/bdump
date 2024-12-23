import { useStore } from "@/services/store/provider";
import useStoreActions from "@/services/store/actions";
import { createRef, FocusEvent, useEffect, useRef, useState } from "react";
import InputButtons from "./pageComponents/InputButtons";
import NoteTitleArea from "./pageComponents/NoteTitleArea";
import NoteTextArea from "./pageComponents/NoteTextArea";

const CreatePage = () => {
  const actions = useStoreActions();
  const store = useStore();
  const currentNote = store.currentNote;

  useEffect(()=>{
    
  })

  const [title, setTitle] = useState<string>();

  const newTitle = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    setTitle(e.target.value);
  };

  const updateTitle = () => {
    store.updateCurrentNote((note) => {
      return {
        ...note,
        file_name: title ? title : "",
      };
    });
  };

  return (
    <>
      <NoteTitleArea
        value={currentNote?.file_name}
        onChange={newTitle}
        onBlur={updateTitle}
      />
      <NoteTextArea
        lightText={currentNote?.transcript}
        mainText={currentNote?.content}
        pulse={actions.storeActionStatus}
      />
    </>
  );
};

export default CreatePage;
