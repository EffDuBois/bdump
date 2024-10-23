"use client";
import { useEffect, useState } from "react";

import useNotesDb, { Note } from "@/utils/data";
import useTranscriber from "@/utils/transcriber";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";

import { interfaceFont } from "@/ui/fonts";

import FileDrawer from "./(components)/FileDrawer";
import InputButtons from "./(components)/mainarea/InputButtons";
import NoteTitleArea from "./(components)/mainarea/NoteTitleArea";
import NoteTextArea from "./(components)/mainarea/NoteTextArea";

import FileDrawerButton from "./(components)/buttons/FileDrawerButton";

import { getTitleFromPath } from "@/utils/utils";
import { PartialBy } from "@/utils/custom_types";
import { ConnectionStatusMap } from "./(components)/mappings/ConnectionStatus";

export type recordingType = "note" | "query";

export default function Home() {
  const notesDb = useNotesDb();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<PartialBy<Note, "id">>();

  const [transcript, setTranscript] = useState("");

  const transcriber = useTranscriber(setTranscript);

  const [isRecording, setIsRecording] = useState<recordingType>();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const getNotes = async () => {
    notesDb.fetchAllNotes().then((notes) => setNotes(notes));
  };

  useEffect(() => {
    //Fetching notes
    if (notesDb.storeStatus && !notesDb.storeTxnStatus) {
      getNotes();
    }
  }, [notesDb.storeStatus, notesDb.storeTxnStatus]);

  const createEmptyNote = async () => {
    notesDb
      .storeNote({
        path: "",
        content: "",
      })
      .then((newNote) => {
        setCurrentNote(newNote);
      });
  };

  const updateNSyncNote = async (note: PartialBy<Note, "id">) => {
    notesDb.putNote(note).then((updatedNote) => {
      setCurrentNote(updatedNote);
    });
  };

  const updateTitle = async (
    title: string,
    note: PartialBy<Note, "id"> | undefined
  ) => {
    if (note) {
      const path = note.path.replace(/[^\/]+$/, title);
      updateNSyncNote({ ...note, path });
    } else {
      //handle no note alert
    }
  };

  const toggleRecording = async (type?: recordingType) => {
    transcriber.toggleTranscription();
    const currentRecording = isRecording;
    setIsRecording((cur) => (cur ? undefined : type));

    if (transcript && currentRecording === "note") {
      try {
        const processedData = await postCreateNote(
          currentNote?.content + " " + transcript
        );
        //existing note
        if (currentNote?.id && currentNote.path) {
          updateNSyncNote({
            id: currentNote.id,
            path: currentNote.path,
            content: processedData.body,
            embedding: processedData.embedding,
          });
          setTranscript("");
        }
        //new note
        else {
          updateNSyncNote({
            path: `/${processedData.title}`,
            content: processedData.body,
            embedding: processedData.embedding,
          });
          setTranscript("");
        }
      } catch (error) {
        console.error(error);
      }
    } else if (type === "query") {
      setCurrentNote({ path: "/Ask", content: "" });
    } else if (currentRecording === "query") {
      try {
        const queryResponse = await postQueryNote({
          query: transcript,
          data: notes
            .filter((note) => note.embedding && note.id)
            .map((note) => ({
              id: note.id,
              path: note.path,
              note: note.content,
              embedding: note.embedding as Float32Array,
            })),
        });
        setCurrentNote({
          path: "/Response",
          content: queryResponse.body,
        });
        setTranscript("");
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
          setDrawerOpen={setDrawerOpen}
          deleteNote={notesDb.deleteNote}
        />
      )}
      <div
        className={`flex flex-col justify-stretch w-full h-screen ${
          drawerOpen && "max-md:hidden"
        }`}
      >
        <FileDrawerButton
          hidden={drawerOpen}
          drawerOpen={() => setDrawerOpen((cur) => !cur)}
        />

        <div className="grow sm:text-2xl sm:px-[20%] px-8 overflow-y-auto">
          <NoteTitleArea
            updateTitle={(newTitle) => updateTitle(newTitle, currentNote)}
            noteTitle={
              currentNote?.path
                ? getTitleFromPath(currentNote?.path)
                : undefined
            }
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
        <div className={`text-end text-neutral-400 ${interfaceFont.className}`}>
          {ConnectionStatusMap[transcriber.connectionStatus]}
        </div>
      </div>
    </main>
  );
}
