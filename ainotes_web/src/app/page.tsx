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
import { PartialExcept } from "@/utils/custom_types";

export type recordingType = "note" | "query";

export default function Home() {
  const store = useStore();
  const [currentNote, setCurrentNote] = useState<
    PartialExcept<Note, "transcript">
  >({
    transcript: "",
  });
  const setTranscript = (
    updateMethod: string | ((oldvalue: string) => string)
  ) => {
    if (typeof updateMethod === "string")
      setCurrentNote({ ...currentNote, transcript: updateMethod });
    else
      setCurrentNote((oldNote) => {
        return { ...oldNote, transcript: updateMethod(oldNote.transcript) };
      });
  };

  const transcriber = useTranscriber(setTranscript);

  const [isRecording, setIsRecording] = useState<recordingType>();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleRecording = async (type?: recordingType) => {
    transcriber.toggleTranscription();
    const currentRecording = isRecording;
    setIsRecording((cur) => (cur ? undefined : type));

    if (currentNote.transcript && currentRecording === "note") {
      const tempNote=await store.putNote(currentNote);
      const newNote = await store.createNote(
        tempNote?.content + " " + tempNote.transcript,
        tempNote
      );
      setCurrentNote(newNote);
      setTranscript("");
    } else if (type === "query") {
      setCurrentNote({
        content: "",
        file_name: "Ask",
        transcript: "",
      });
    } else if (currentRecording === "query") {
      const queryResponse = await store.queryNotes(currentNote.transcript);
      setCurrentNote({
        content: (currentNote.transcript
          ? "\n\n" + queryResponse.body
          : "") as string,
        file_name: currentNote.file_name,
        transcript: currentNote.transcript,
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
            transcript={currentNote.transcript}
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
