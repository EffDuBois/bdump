"use client";
import NoteTextArea from "../components/pages/pageComponents/NoteTextArea";
import useTranscriber from "@/services/transcriber";
import { useState } from "react";
import { queryNotes } from "@/lib/apiHandlers";
import ConnectionIndicator from "@/components/auxilary/ConnectionIndicator";
import VersionTag from "@/components/auxilary/VersionTag";
import BottomBar from "@/components/BottomBar";
import RecordPanel from "@/components/buttons/RecordPanel";

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
    <main className="flex flex-col flex-1 items-center content-center w-full h-screen ">
      <div className="h-full w-4/5 overflow-y-auto flex flex-col justify-center items-center gap-5">
        <h1>Ask Anything from your notes</h1>
        {response ? (
          <NoteTextArea mainText={response} />
        ) : (
          <p className="w-full text-center">
            Try saying "Tell me the name of movie with Jhon Cena in it"
          </p>
        )}
      </div>
      <div className="w-full flex flex-col items-center bg-background sticky bottom-0 left-0">
        <RecordPanel
          onClick={onAskButtonPress}
          onClear={() => setQuery("")}
          showClearButton={!!query}
        />
        <div className=" w-full flex justify-between ">
          <VersionTag version="1.1.0-beta" />
          <ConnectionIndicator
            connectionStatus={transcriber.connectionStatus}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
