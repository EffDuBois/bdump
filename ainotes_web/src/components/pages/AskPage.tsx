import { useStore } from "@/services/store/provider";
import NoteTextArea from "../mainComponents/NoteTextArea";
import NoteTitleArea from "../mainComponents/NoteTitleArea";
import useStoreActions from "@/services/store/actions";

const AskPage = () => {
  const store = useStore();
  const actions = useStoreActions();
  const askData = store.askData;
  return (
    <>
      <NoteTitleArea title="Ask" />
      <NoteTextArea
        lightText={askData.query}
        mainText={askData.response}
        pulse={actions.storeActionStatus}
      />
    </>
  );
};

export default AskPage;
