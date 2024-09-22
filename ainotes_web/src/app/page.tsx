"use client";

import { postCreateNote } from "@/apis/postCreateNote";
import useNotesDb, { Note } from "@/utils/data";
import useTranscriber from "@/utils/transcriber";
import { useEffect, useState } from "react";
import NoteTextArea from "../components/NoteTextArea";
import FileDrawer from "@/components/FileDrawer";
import InputButtons from "@/components/InputButtons";
import { postQueryNote } from "@/apis/postQueryNote";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const [currentNote, setCurrentNote] = useState<Note>({
    id: "",
    path: "",
    content: "",
    vembed: new Float32Array(),
  });

  const transcriber = useTranscriber(setTranscript);
  const notesDb = useNotesDb();

  const createEmptyNote = async () => {
    notesDb.storeNote({
      path: "/Untitled",
      content: "",
      vembed: new Float32Array(),
    });
  };

  const getNotes = async () => {
    notesDb.fetchAllNotes().then((notes) => setNotes(notes));
  };

  useEffect(() => {
    if (!notesDb.storeTxnStatus) {
      getNotes();
    }
  }, [notesDb.storeTxnStatus]);

  const toggleNoteRecording = async () => {
    transcriber.toggleTranscription();
    setIsRecording((cur) => !cur);

    if (isRecording) {
      try {
        const processedData = await postCreateNote(transcript);
        if (currentNote.id) {
          const updatedNote = await notesDb.updateNote(currentNote.id, {
            path: currentNote.path,
            content: processedData,
            vembed: processedData.embedding,
          });
          setCurrentNote(updatedNote);
        } else {
          const newNote = await notesDb.storeNote({
            path: "/Untitled",
            content: processedData.body,
            vembed: processedData.embedding,
          });
          setCurrentNote(newNote);
          setTranscript("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const toggleQueryRecording = async () => {
    transcriber.toggleTranscription();
    setIsRecording((cur) => !cur);

    if (isRecording) {
      try {
        const queryResponse = await postQueryNote({
          query: transcript,
          data: notes.map((note) => ({
            note: note.content,
            embedding: note.vembed,
          })),
        });
        setTranscript("");
        setCurrentNote({
          id: "",
          path: "/Query",
          content: queryResponse.content,
          vembed: new Float32Array(),
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <FileDrawer
        notes={notes}
        notesDb={notesDb}
        createEmptyNote={createEmptyNote}
      />
      <NoteTextArea currentNote={currentNote} transcript={transcript} />
      <InputButtons
        toggleNoteRecording={toggleNoteRecording}
        toggleQueryRecording={toggleQueryRecording}
        isRecording={isRecording}
      />
    </>
  );
}
