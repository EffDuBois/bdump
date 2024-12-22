import { useStore } from "@/services/store/provider";
import NoteTextArea from "../pageComponents/NoteTextArea";
import NoteTitleArea from "../pageComponents/NoteTitleArea";
import useStoreActions from "@/services/store/actions";

const AskPage = () => {
  const store = useStore();
  const actions = useStoreActions();
  const askData = store.askData;
  return (
    <>
      <NoteTitleArea defaultValue={"Ask"} disabled />
      <NoteTextArea
        lightText={askData.query}
        mainText={askData.response}
        pulse={actions.storeActionStatus}
      />
    </>
  );
};

export default AskPage;
