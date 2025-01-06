"use client";
import NoteTextArea from "../components/pages/pageComponents/NoteTextArea";
import NoteTitleArea from "../components/pages/pageComponents/NoteTitleArea";
import MainActionButton from "../components/buttons/MainActionButton";
import useTranscriber from "@/services/transcriber";
import { useState } from "react";
import { queryNotes } from "@/lib/apiHandlers";
import ConnectionIndicator from "@/components/ConnectionIndicator";

const Home = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const transcriber = useTranscriber(setQuery);

  const onAskButtonPress = async () => {
    try {
      if (transcriber.recording) {
        if (query !== "") {
          const response = await queryNotes(query);
          setResponse(`## ${query}` + "\n\n" + response);
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
        <NoteTitleArea value={""} disabled />
        <NoteTextArea mainText={response} />
      </div>
      <MainActionButton onClick={onAskButtonPress}>Ask</MainActionButton>
      <ConnectionIndicator connectionStatus={transcriber.connectionStatus} />
    </main>
  );
};

export default Home;
