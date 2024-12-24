import { useStore } from "@/services/store/provider";
import NoteTextArea from "./pageComponents/NoteTextArea";
import NoteTitleArea from "./pageComponents/NoteTitleArea";

const AskPage = () => {
  const store = useStore();
  const askData = store.askData;
  return (
    <>
      <NoteTitleArea defaultValue={"Ask"} disabled />
      <NoteTextArea
        lightText={askData.query}
        mainText={askData.response}
      />
    </>
  );
};

export default AskPage;
