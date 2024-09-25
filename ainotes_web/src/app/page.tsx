"use client";

import { postCreateNote } from "@/apis/postCreateNote";
import useNotesDb, { Note } from "@/utils/data";
import useTranscriber from "@/utils/transcriber";
import { useEffect, useState } from "react";
import NoteTextArea from "../pageComponents/NoteTextArea";
import FileDrawer from "@/pageComponents/FileDrawer";
import InputButtons from "@/pageComponents/InputButtons";
import { postQueryNote } from "@/apis/postQueryNote";
import DrawerToggle from "@/pageComponents/DrawerToggle";
import NoteTitleArea from "@/pageComponents/NoteTitleArea";
import { getTitleFromPath } from "@/utils/utils";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [isRecordingNote, setIsRecordingNote] = useState(false);
  const [isRecordingQuery, setIsRecordingQuery] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const [currentNote, setCurrentNote] = useState<Note>({
    id: undefined,
    path: "",
    content: "",
    vembed: new Float32Array(),
  });

  const transcriber = useTranscriber(setTranscript);
  const notesDb = useNotesDb();

  const createEmptyNote = async () => {
    notesDb
      .storeNote({
        path: "/Untitled",
        content: "",
        vembed: new Float32Array(),
      })
      .then((newNote) => {
        setCurrentNote(newNote);
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

  const updateNSyncNote = async (note: Omit<Note, "id"> & { id?: number }) => {
    notesDb.updateNote(note).then((updatedNote) => {
      setCurrentNote(updatedNote);
    });
  };

  const updateTitle = async (title: string, currentNote: Note) => {
    const path = currentNote.path.replace(/[^\/]+$/, title);
    updateNSyncNote({ ...currentNote, path });
  };

  const toggleNoteRecording = async () => {
    transcriber.toggleTranscription();
    setIsRecordingNote((cur) => !cur);

    if (isRecordingNote) {
      if (transcript) {
        try {
          const processedData = await postCreateNote(
            currentNote.content + " " + transcript
          );
          if (currentNote.id) {
            updateNSyncNote({
              id: currentNote.id,
              path: currentNote.path,
              content: processedData.body,
              vembed: processedData.embedding,
            });
            setTranscript("");
          } else {
            updateNSyncNote({
              path: `/${processedData.title}`,
              content: processedData.body,
              vembed: processedData.embedding,
            });
            setTranscript("");
          }
        } catch (error) {
          console.error(error);
        }
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
          id: undefined,
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
      {drawerOpen && (
        <FileDrawer
          notes={notes}
          storeTxnStatus={notesDb.storeTxnStatus}
          setCurrentNote={setCurrentNote}
          createEmptyNote={createEmptyNote}
        >
          <DrawerToggle setDrawerOpen={setDrawerOpen} />
        </FileDrawer>
      )}
      <div
        className={`flex flex-col w-full h-screen pb-20 ${
          drawerOpen && "max-md:hidden"
        }`}
      >
        <DrawerToggle
          disabled={drawerOpen}
          className={`${drawerOpen && "opacity-0"}`}
          setDrawerOpen={setDrawerOpen}
        />
        <NoteTitleArea
          updateTitle={(newTitle) => updateTitle(newTitle, currentNote)}
          noteTitle={getTitleFromPath(currentNote.path)}
        />
        <NoteTextArea
          currentNote={currentNote}
          transcript={transcript}
          isRecording={isRecordingNote || isRecordingQuery}
        />

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
