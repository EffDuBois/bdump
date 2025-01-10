"use client";
import ConnectionIndicator from "@/components/auxilary/ConnectionIndicator";
import VersionTag from "@/components/auxilary/VersionTag";
import RecordPanel from "@/components/buttons/RecordPanel";
import NoteTextArea from "@/components/pages/pageComponents/NoteTextArea";
import NoteTitleArea from "@/components/pages/pageComponents/NoteTitleArea";
import { createNote, editNote } from "@/lib/apiHandlers";
import type { Note } from "@/services/database/dataModels";
import { useDb } from "@/services/database/dbProvider";

import useTranscriber from "@/services/transcriber";
import { valueOrActionFunction } from "@/utils/custom_types";
import { useRouter } from "next/navigation";
import { FocusEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Note({ params }: { params: { id: string } }) {
  const { fetchNote, putNote, dbChange } = useDb();
  const router = useRouter();
  const id = Number(params.id);

  const [currentNote, setCurrentNote] = useState<Note>();

  const getCurrentNote = async () => {
    const note = await fetchNote(id);
    if (note) {
      setCurrentNote(note);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    getCurrentNote();
  }, [dbChange]);

  const updateCurrentNote: valueOrActionFunction<Note> = (updateObj) => {
    if (currentNote) {
      if (typeof updateObj === "function") {
        putNote(updateObj(currentNote))
          .then((note) => {
            setCurrentNote(note);
          })
          .catch((error) => console.error(error));
      } else {
        putNote(updateObj)
          .then((note) => {
            setCurrentNote(note);
          })
          .catch((error) => {
            if (error.name === "DataError")
              toast("File with name Already Exists");
            console.error(error);
          });
      }
    }
  };

  const updateTranscript: valueOrActionFunction<string> = (updateObj) => {
    if (typeof updateObj === "function") {
      updateCurrentNote((oldNote) => {
        // console.log(updateObj(oldNote.transcript));
        return {
          ...oldNote,
          transcript: updateObj(oldNote.transcript),
        };
      });
    } else {
      updateCurrentNote((oldnote) => {
        return { ...oldnote, transcript: updateObj };
      });
    }
  };

  const updateTitle: valueOrActionFunction<string> = (updateObj) => {
    if (typeof updateObj === "function") {
      updateCurrentNote((oldNote) => {
        return {
          ...oldNote,
          file_name: updateObj(oldNote.transcript),
        };
      });
    } else {
      updateCurrentNote((oldnote) => {
        return { ...oldnote, file_name: updateObj };
      });
    }
  };

  const transcriber = useTranscriber(updateTranscript);

  const onCreate = () => {
    try {
      if (transcriber.recording)
        if (currentNote)
          createNote(currentNote).then((note) => {
            updateCurrentNote(note);
          });
    } finally {
      transcriber.toggleTranscription();
    }
  };

  const onEdit = () => {
    try {
      if (transcriber.recording)
        if (currentNote)
          editNote(currentNote).then((note) => {
            updateCurrentNote(note);
          });
    } finally {
      transcriber.toggleTranscription();
    }
  };

  const [title, setTitle] = useState<string>();

  useEffect(() => {
    setTitle(currentNote?.file_name || "");
  }, [currentNote?.file_name]);

  const setTempTitle = (e: FocusEvent<HTMLInputElement, Element>) => {
    setTitle(e.target.value);
  };

  return (
    <>
      <main className="flex flex-col flex-1 items-center content-center w-full h-screen ">
        <div className="h-full w-4/5 overflow-y-auto">
          {currentNote && (
            <>
              <NoteTitleArea
                value={title}
                onChange={setTempTitle}
                onBlur={() => {
                  if (title && title !== "") updateTitle(title);
                }}
              />
              <NoteTextArea
                lightText={currentNote?.transcript}
                mainText={currentNote?.content}
              />
            </>
          )}
        </div>
        <div className="w-full flex flex-col items-center pt-3 bg-background sticky bottom-0 left-0">
          <RecordPanel
            onClick={onCreate}
            onClear={() => updateTranscript("")}
            showClearButton={!!currentNote?.transcript}
          />
          <div className=" w-full flex justify-between ">
            <VersionTag version="1.1.0-beta" />
            <ConnectionIndicator
              connectionStatus={transcriber.connectionStatus}
            />
          </div>
        </div>
      </main>
    </>
  );
}
