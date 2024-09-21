"use client";

import { postCreateNote } from "@/apis/postCreateNote";
import { subtextFont, titleFont } from "@/ui/fonts";
import SideBar from "@/ui/Sidebar";
import useNotesDb, { Note } from "@/utils/data";
import useTranscriber from "@/utils/transcriber";
import { getTitle } from "@/utils/utils";
import { useEffect, useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa6";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const transcriber = useTranscriber(setTranscript);
  const notesDB = useNotesDb();

  const [isRecording, setIsRecording] = useState(false);

  const [currentNote, setCurrentNote] = useState<Note>({
    id: "",
    path: "",
    content: "",
    vembed: [],
  });

  useEffect(() => {}, []);

  async function toggleRecording() {
    transcriber.toggleTranscription();
    setIsRecording((cur) => !cur);
    if (isRecording) {
      postCreateNote(transcript).then(async (res) => {
        const newNote = await notesDB.storeNote({
          path: "/Untitled",
          content: res.body,
          vembed: res.embedding,
        });
        setTranscript("");
        setCurrentNote(newNote);
      });
    }
  }

  return (
    <>
      <SideBar notesDb={notesDB} />
      {currentNote.path ? (
        <h1 className="text-4xl">{getTitle(currentNote)}</h1>
      ) : (
        <h1 className={`${titleFont.className} text-4xl`}>NotesAPP</h1>
      )}

      <div className="h-[50vh] sm:text-2xl text-xl w-full lg:w-2/5">
        {currentNote.content || transcript ? (
          <>
            <Markdown remarkPlugins={[remarkGfm]}>
              {currentNote?.content}
            </Markdown>
            <Markdown
              className={`${subtextFont.className} inline`}
              remarkPlugins={[remarkGfm]}
            >
              {transcript}
            </Markdown>
          </>
        ) : (
          "Placeholder Text"
        )}
      </div>
      <button
        onClick={toggleRecording}
        className={`flex items-center justify-center self-center shadow-[0_0_4px_-0.8px_rgba(0,0,0,1)] dark:shadow-[0_0_4px_-0.8px_rgba(255,255,255,1)] no-dark:shadow-[inset_1.6px_1.6px_3px_-3px_rgba(256,256,256,1),1px_1px_0.2px_1px_rgba(0,0,0,1)] rounded-full`}
        style={{ width: "64px", height: "64px" }}
      >
        {isRecording ? (
          <FaStop className="text-black" size={"38px"} />
        ) : (
          <FaMicrophone className="size-12" size={"64px"} />
        )}
      </button>
    </>
  );
}
