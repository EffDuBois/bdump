"use client";
import { useContext, useEffect, useState } from "react";

import useNotesDb from "@/services/database/idbService";
import useTranscriber from "@/services/transcriber";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";

import { interfaceFont } from "@/ui/fonts";

import FileDrawer from "./(components)/FileDrawer";
import InputButtons from "./(components)/mainarea/InputButtons";
import NoteTitleArea from "./(components)/mainarea/NoteTitleArea";
import NoteTextArea from "./(components)/mainarea/NoteTextArea";

import { getTitleFromPath } from "@/utils/utils";
import { PartialBy } from "@/utils/custom_types";
import { ConnectionStatusMap } from "./(components)/mappings/ConnectionStatus";
import { Store, useStore } from "@/services/store/provider";
import { Note } from "@/services/database/dataModels";
import storeActions from "@/services/store/actions";

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
    <Store.Provider value={storeActions()}>
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

          <div
            className={`self-end text-neutral-400 ${interfaceFont.className}`}
          >
            {ConnectionStatusMap[transcriber.connectionStatus]}
          </div>
        </div>
      </main>
    </Store.Provider>
  );
}
