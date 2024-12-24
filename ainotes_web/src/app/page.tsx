"use client";

import { useStore } from "@/services/store/provider";
import CreatePage from "@/components/pages/CreatePage";
import InputButtons from "@/components/pages/pageComponents/InputButtons";
import AskPage from "@/components/pages/AskPage";
import { useEffect, useState } from "react";
import useTranscriber from "@/services/transcriber";
import { ConnectionStatusMap } from "@/components/mappings/ConnectionStatus";
import { interfaceFont } from "@/ui/fonts";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ModeToggle";

export type modeType = "CREATE" | "ASK";

export default function Home() {
  const store = useStore();

  const [mode, setMode] = useState<modeType>("CREATE");

  useEffect(() => {
    if (mode !== "CREATE") setMode("CREATE");
  }, [store.currentNote]);

  const createTranscriber = useTranscriber(store.updateTranscript);
  const askTranscriber = useTranscriber(store.updateQuery);

  const isRecording = createTranscriber.recording || askTranscriber.recording;

  const onCreate = () => {
    try {
      if (mode !== "CREATE") setMode("CREATE");
      if (isRecording) store.createNote();
    } finally {
      createTranscriber.toggleTranscription();
    }
  };

  const onAsk = () => {
    try {
      if (mode !== "ASK") setMode("ASK");
      if (isRecording) store.queryNotes();
    } finally {
      askTranscriber.toggleTranscription();
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center content-center w-[75vw] h-screen ">
      <div className="w-full flex justify-between p-2">
        <SidebarTrigger />
        <ModeToggle />
      </div>
      <div className="h-[84vh] w-4/5 overflow-y-auto">
        {mode === "CREATE" ? (
          <CreatePage />
        ) : mode === "ASK" ? (
          <AskPage />
        ) : null}
      </div>
      <InputButtons
        disabled={
          store.apiStatus ||
          createTranscriber.connectionStatus === "disconnected" ||
          askTranscriber.connectionStatus === "disconnected"
        }
        showUndo={
          mode === "CREATE"
            ? !!store.currentNote?.transcript
            : !!store.askData.query
        }
        isRecording={isRecording}
        mode={mode}
        clearLightText={
          mode === "CREATE"
            ? () => store.updateTranscript("")
            : () => store.updateQuery("")
        }
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
