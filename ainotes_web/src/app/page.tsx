"use client";

import { useStore } from "@/services/store/provider";
import CreatePage from "@/components/pages/CreatePage";
import InputButtons from "@/components/mainComponents/InputButtons";
import AskPage from "@/components/pages/AskPage";
import { useEffect, useState } from "react";
import useTranscriber from "@/services/transcriber";
import useStoreActions from "@/services/store/actions";
import { ConnectionStatusMap } from "@/components/mappings/ConnectionStatus";
import { interfaceFont } from "@/ui/fonts";

export type modeType = "CREATE" | "ASK";

export default function Home() {
  const store = useStore();
  const actions = useStoreActions();
  const [mode, setMode] = useState<modeType>("CREATE");

  useEffect(() => {
    store.fetchNotes();
    store.initCurrentNote();
  }, []);

  const transcriber = useTranscriber((update) => {
    if (mode === "CREATE") {
      store.updateTranscript(update);
    } else if (mode === "ASK") {
      store.updateQuery(update);
    }
  });

  const [isRecording, setIsRecording] = useState(false);

  const onCreate = () => {
    if (mode !== "CREATE") setMode("CREATE");

    try {
      if (isRecording) {
        actions.createNote();
      } else {
        transcriber.toggleTranscription();
      }
    } finally {
      setIsRecording((prev) => !prev);
    }
  };

  const onAsk = () => {
    if (mode !== "ASK") setMode("ASK");
    try {
      if (isRecording) {
        actions.queryNotes();
      } else {
        transcriber.toggleTranscription();
      }
    } finally {
      setIsRecording((prev) => !prev);
    }
  };

  return (
    <main className="flex flex-col flex-1 justify-center items-center content-center w-full h-screen">
      <div className="h-[75vh] w-[75vw] overflow-auto">
        {mode === "CREATE" ? (
          <CreatePage />
        ) : mode === "ASK" ? (
          <AskPage />
        ) : null}
      </div>
      <InputButtons
        disabled={actions.storeActionStatus && store.currentNoteStatus}
        showUndo={!!store.currentNote?.transcript}
        isRecording={isRecording}
        mode={mode}
        clearLightText={() => store.updateTranscript("")}
        onAsk={onAsk}
        onCreate={onCreate}
      />
      <div
        className={`absolute bottom-0 right-0 text-neutral-400 ${interfaceFont.className}`}
      >
        {ConnectionStatusMap[transcriber.connectionStatus]}
      </div>
    </main>
  );
}
