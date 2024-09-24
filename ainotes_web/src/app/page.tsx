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
  const [isRecordingNote, setIsRecordingNote] = useState(false);
  const [isRecordingQuery, setIsRecordingQuery] = useState(false);
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
    setIsRecordingNote((cur) => !cur);

    if (isRecordingNote) {
      try {
        const processedData = await postCreateNote(
          currentNote.content + " " + transcript
        );
        if (currentNote.id) {
          const updatedNote = await notesDb.updateNote({
            id: currentNote.id,
            path: currentNote.path,
            content: processedData.body,
            vembed: processedData.embedding,
          });
          setCurrentNote(updatedNote);
          setTranscript("");
        } else {
          const newNote = await notesDb.storeNote({
            path: `/${processedData.title}`,
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
    setIsRecordingQuery((cur) => !cur);

    if (isRecordingNote) {
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
    <main className="flex">
      <FileDrawer
        notes={notes}
        storeTxnStatus={notesDb.storeTxnStatus}
        setCurrentNote={setCurrentNote}
        createEmptyNote={createEmptyNote}
      />
      <div className="flex flex-col w-full h-screen pt-12 pb-20">
        <NoteTextArea currentNote={currentNote} transcript={transcript} />
        <InputButtons
          toggleNoteRecording={toggleNoteRecording}
          toggleQueryRecording={toggleQueryRecording}
          isRecordingNote={isRecordingNote}
          isRecordingQuery={isRecordingQuery}
        />
      </div>
    </main>
  );
}
