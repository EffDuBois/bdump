"use client";

import { postCreateNote } from "@/apis/postCreateNote";
import useNotesDb, { Note } from "@/utils/data";
import useTranscriber from "@/utils/transcriber";
import { useState } from "react";
import NoteTextArea from "../components/NoteTextArea";
import FileDrawer from "@/components/FileDrawer";
import InputButtons from "@/components/InputButtons";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: "",
    path: "",
    content: "",
    vembed: [],
  });

  const transcriber = useTranscriber(setTranscript);
  const notesDB = useNotesDb();

  const toggleRecording = async () => {
    transcriber.toggleTranscription();
    setIsRecording((cur) => !cur);

    if (isRecording) {
      const processedData = await postCreateNote(transcript);
      if (currentNote.id) {
        const updatedNote = await notesDB.updateNote(currentNote.id, {
          path: currentNote.path,
          content: processedData,
          vembed: processedData.embedding,
        });
        setCurrentNote(updatedNote);
      } else {
        const newNote = await notesDB.storeNote({
          path: "/Untitled",
          content: processedData.body,
          vembed: processedData.embedding,
        });
        setCurrentNote(newNote);
      }
      setTranscript("");
    }
  };

  return (
    <>
      <FileDrawer notesDb={notesDB} />
      <NoteTextArea currentNote={currentNote} transcript={transcript} />
      <InputButtons
        toggleRecording={toggleRecording}
        isRecording={isRecording}
      />
    </>
  );
}
