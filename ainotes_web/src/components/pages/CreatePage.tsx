import { useStore } from "@/services/store/provider";
import useStoreActions from "@/services/store/actions";
import { createRef, useRef } from "react";
import InputButtons from "../mainComponents/InputButtons";
import NoteTitleArea from "../mainComponents/NoteTitleArea";
import NoteTextArea from "../mainComponents/NoteTextArea";

const CreatePage = () => {
  const actions = useStoreActions();
  const store = useStore();
  const currentNote = store.currentNote;
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const updateTitle = () => {
    if (titleRef && titleRef.current?.value) {
      store.updateCurrentNote((note) => {
        return {
          ...note,
          file_name: titleRef.current ? titleRef.current.value : note.file_name,
        };
      });
    }
  };

  return (
    <>
      <NoteTitleArea
        ref={titleRef}
        title={currentNote?.file_name}
        defaultValue={currentNote?.file_name}
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
