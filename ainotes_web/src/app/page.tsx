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
import TopBar from "@/components/TopBar";

export type modeType = "CREATE" | "ASK";

export default function Home() {
  const {
    currentNote,
    updateTranscript,
    updateQuery,
    createNote,
    editNote,
    queryNotes,
    apiStatus,
    askData,
  } = useStore();

  const [mode, setMode] = useState<modeType>("CREATE");

  useEffect(() => {
    if (mode !== "CREATE") setMode("CREATE");
  }, [currentNote]);

  const createTranscriber = useTranscriber(updateTranscript);
  const askTranscriber = useTranscriber(updateQuery);

  const isRecording = createTranscriber.recording || askTranscriber.recording;

  const onCreate = () => {
    try {
      if (mode !== "CREATE") setMode("CREATE");
      if (isRecording) createNote();
    } finally {
      createTranscriber.toggleTranscription();
    }
  };
  const onEdit = () => {
    try {
      if (mode !== "CREATE") setMode("CREATE");
      if (isRecording) editNote();
    } finally {
      createTranscriber.toggleTranscription();
    }
  };

  const onAsk = () => {
    try {
      if (mode !== "ASK") setMode("ASK");
      if (isRecording) queryNotes();
    } finally {
      askTranscriber.toggleTranscription();
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center content-center w-[75vw] h-screen ">
      <TopBar />
      <div className="h-[84vh] w-4/5 overflow-y-auto">
        {mode === "CREATE" ? (
          <CreatePage />
        ) : mode === "ASK" ? (
          <AskPage />
        ) : null}
      </div>
      <InputButtons
        disabled={
          apiStatus ||
          createTranscriber.connectionStatus === "disconnected" ||
          createTranscriber.connectionStatus === "connecting" ||
          askTranscriber.connectionStatus === "disconnected" ||
          askTranscriber.connectionStatus === "connecting"
        }
        showUndo={
          mode === "CREATE" ? !!currentNote?.transcript : !!askData.query
        }
        isRecording={isRecording}
        mode={mode}
        time={mode === "CREATE" ? createTranscriber.time : askTranscriber.time}
        edit={!!currentNote?.content}
        clearLightText={
          mode === "CREATE" ? () => updateTranscript("") : () => updateQuery("")
        }
        onAsk={onAsk}
        onCreate={onCreate}
        onEdit={onEdit}
      />
      <p
        className={`z-10 absolute bottom-0 left-0 text-neutral-400 ${interfaceFont.className}`}
      >
        v1.0.1-beta
      </p>
      <div
        className={`absolute bottom-0 right-0 text-neutral-400 ${interfaceFont.className}`}
      >
        {ConnectionStatusMap[createTranscriber.connectionStatus]}
      </div>
    </main>
  );
}
