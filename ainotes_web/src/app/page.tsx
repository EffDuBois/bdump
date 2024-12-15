"use client";
import { useEffect, useState } from "react";

import { interfaceFont } from "@/ui/fonts";

import useTranscriber from "@/services/transcriber";

import { Note } from "@/services/database/dataModels";

import FileDrawer from "./(components)/FileDrawer";
import InputButtons from "./(components)/mainarea/InputButtons";
import NoteTitleArea from "./(components)/mainarea/NoteTitleArea";
import NoteTextArea from "./(components)/mainarea/NoteTextArea";

import { ConnectionStatusMap } from "./(components)/mappings/ConnectionStatus";
import { PartialExcept } from "@/utils/custom_types";
import useStoreActions from "@/services/store/useStoreActions";
import { useDb } from "@/services/database/Provider";

export type recordingType = "note" | "query";
export type setTranscriptType = (
  updateMethod: string | ((oldvalue: string) => string)
) => void;

export default function Home() {
  const db = useDb();
  const storeActions = useStoreActions();

  const [currentNote, setCurrentNote] = useState<
    PartialExcept<Note, "transcript">
  >({
    transcript: "",
  });

  const setTranscript: setTranscriptType = (updateMethod) => {
    if (typeof updateMethod === "string")
      setCurrentNote({ ...currentNote, transcript: updateMethod });
    else
      setCurrentNote((oldNote) => {
        return { ...oldNote, transcript: updateMethod(oldNote.transcript) };
      });
  };

  const initCurrentNote = async () => {
    if (!currentNote.id) {
      storeActions.getEmptyNote().then((note) => {
        if (note) setCurrentNote(note);
      });
    }
  };

  useEffect(() => {
    initCurrentNote();
  }, []);

  const transcriber = useTranscriber(setTranscript);

  const [isRecording, setIsRecording] = useState<recordingType>();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleRecording = async (type?: recordingType) => {
    transcriber.toggleTranscription();
    const currentRecording = isRecording;
    setIsRecording((cur) => (cur ? undefined : type));

    if (currentNote.transcript && currentRecording === "note") {
      try {
        const newNote = await storeActions.createNote(
          currentNote?.content + " " + currentNote.transcript,
          currentNote
        );
        if (newNote) {
          setCurrentNote(newNote);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (currentNote.transcript && currentRecording === "query") {
      const queryResponse = await storeActions.queryNotes(
        currentNote.transcript
      );
      setCurrentNote({
        content: (currentNote.transcript
          ? "\n\n" + queryResponse.body
          : "") as string,
        file_name: currentNote.file_name,
        transcript: "",
      });
    }
    if (type === "query") {
      setCurrentNote({
        content: "",
        file_name: "Ask",
        transcript: "",
      });
    } else if (type === "note") {
      await initCurrentNote();
    }
  };

  return (
    <main className="flex flex-col md:flex-row h-screen w-screen">
      <FileDrawer
        currentNote={currentNote}
        setCurrentNote={setCurrentNote}
        drawerStateObject={{ state: drawerOpen, setState: setDrawerOpen }}
      />
      <div className="flex flex-col justify-between items-center content-center w-full h-full pt-20 px-20">
        <div className=" h-full w-full overflow-auto">
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
          transcript={currentNote.transcript}
          setTranscript={setTranscript}
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
