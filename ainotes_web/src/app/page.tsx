"use client";
import NoteTextArea from "../components/pages/pageComponents/NoteTextArea";
import NoteTitleArea from "../components/pages/pageComponents/NoteTitleArea";
import MainActionButton from "../components/buttons/MainActionButton";
import useTranscriber from "@/services/transcriber";
import { useState } from "react";
import { queryNotes } from "@/lib/apiHandlers";

const AskPage = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const transcriber = useTranscriber(setQuery);

  const onAsk = async () => {
    try {
      if (transcriber.recording) {
        if (query !== "") {
          const response = await queryNotes(query);
          setResponse(query + "\n\n" + response);
          setQuery("");
        } else {
          console.log("ASK:No query");
        }
      }
    } finally {
      transcriber.toggleTranscription();
    }
  };

  return (
    <main className="flex flex-col flex-1 items-center content-center w-[75vw] h-screen ">
      <div className="h-full w-4/5 overflow-y-auto">
        <NoteTitleArea defaultValue={"Ask"} disabled />
        <NoteTextArea lightText={query} mainText={response} />
      </div>
      <MainActionButton onClick={onAsk}>Ask</MainActionButton>
    </main>
  );
};

export default AskPage;
