"use client";
import { useState } from "react";

import { interfaceFont } from "@/ui/fonts";

import { useStore } from "@/services/store/storeProvider";
import useTranscriber from "@/services/transcriber";

import { Note } from "@/services/database/dataModels";

import FileDrawer from "./(components)/FileDrawer";
import InputButtons from "./(components)/mainarea/InputButtons";
import NoteTitleArea from "./(components)/mainarea/NoteTitleArea";
import NoteTextArea from "./(components)/mainarea/NoteTextArea";

import { ConnectionStatusMap } from "./(components)/mappings/ConnectionStatus";

export type recordingType = "note" | "query";

export default function Home() {
  const store = useStore();
  const [currentNote, setCurrentNote] = useState<Partial<Note>>();
  const [transcript, setTranscript] = useState("");

  const transcriber = useTranscriber(setTranscript);

  const [isRecording, setIsRecording] = useState<recordingType>();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleRecording = async (type?: recordingType) => {
    transcriber.toggleTranscription();
    const currentRecording = isRecording;
    setIsRecording((cur) => (cur ? undefined : type));

    if (transcript && currentRecording === "note") {
      const newNote = await store.createNote(
        currentNote?.content + " " + transcript,
        currentNote
      );
      setCurrentNote(newNote);
      setTranscript("");
    } else if (type === "query") {
      setCurrentNote({ path: "/Ask", content: "" });
    } else if (currentRecording === "query") {
      const queryResponse = await store.queryNotes(transcript);
      setCurrentNote({
        content: transcript + "\n\n" + queryResponse.body,
      });
      setTranscript("");
    }
  };

  return (
    <main className="flex">
      <FileDrawer
        setCurrentNote={setCurrentNote}
        drawerStateObject={{ state: drawerOpen, setState: setDrawerOpen }}
      />
      <div
        className={`flex flex-col justify-between items-center content-center w-full h-screen pt-20 px-20${
          drawerOpen && "max-md:hidden"
        }`}
      >
        <div className="h-[75vh] w-[75vw] overflow-auto px-20">
          <NoteTitleArea
            currentNote={currentNote}
            setCurrentNote={setCurrentNote}
          />
          <NoteTextArea
            noteContent={currentNote?.content}
            transcript={transcript}
            isRecording={isRecording}
          />
        </div>

        <InputButtons
          toggleRecording={toggleRecording}
          isRecording={isRecording}
        />

        <div className={`self-end text-neutral-400 ${interfaceFont.className}`}>
          {ConnectionStatusMap[transcriber.connectionStatus]}
        </div>
      </div>
    </main>
  );
}
