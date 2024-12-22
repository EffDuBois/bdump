"use client";

import { useStore, valueOrActionFunction } from "@/services/store/provider";
import CreatePage from "@/components/pages/CreatePage";
import InputButtons from "@/components/pageComponents/InputButtons";
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

  const createTranscriber = useTranscriber(store.updateTranscript);
  const askTranscriber = useTranscriber(store.updateQuery);

  const isRecording = createTranscriber.recording || askTranscriber.recording;

  const onCreate = () => {
    try {
      if (mode !== "CREATE") setMode("CREATE");
      if (isRecording) actions.createNote();
    } finally {
      createTranscriber.toggleTranscription();
    }
  };

  const onAsk = () => {
    try {
      if (mode !== "ASK") setMode("ASK");
      if (isRecording) actions.queryNotes();
    } finally {
      askTranscriber.toggleTranscription();
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
        disabled={
          actions.storeActionStatus ||
          !store.currentNoteStatus ||
          createTranscriber.connectionStatus === "disconnected" ||
          askTranscriber.connectionStatus === "disconnected"
        }
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
        {ConnectionStatusMap[createTranscriber.connectionStatus]}
      </div>
    </main>
  );
}
