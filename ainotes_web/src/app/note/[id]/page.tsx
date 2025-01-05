import { useStore } from "@/services/store/provider";
import CreatePage from "@/components/pages/CreatePage";
import AskPage from "@/app/page";
import { ConnectionStatusMap } from "@/components/mappings/ConnectionStatus";
import { interfaceFont } from "@/ui/fonts";

export type modeType = "CREATE" | "ASK";

export default function Home() {
  const {
    createNote,
    editNote,
  } = useStore();

  const onCreate = () => {
    try {
      if (transcriber.recording) createNote();
    } finally {
      transcriber.toggleTranscription();
    }
  };

  const onEdit = () => {
    try {
      if (isRecording) editNote();
    } finally {
      createTranscriber.toggleTranscription();
    }
  };

  return (
        {mode === "CREATE" ? (
          <CreatePage />
        ) : mode === "ASK" ? (
          <AskPage />
        ) : null}

      <p
        className={`z-10 absolute bottom-0 left-0 text-neutral-400 ${interfaceFont.className}`}
      >
        v1.0.1-beta
      </p>


  );
}
