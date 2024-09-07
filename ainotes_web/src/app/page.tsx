"use client";

import { postCreateNote } from "@/apis/postCreateNote";
import { subtextFont } from "@/ui/fonts";
import useTranscriber from "@/utils/transcriber";
import { useState } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa6";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const transcriber = useTranscriber(`~~Make your chicken noodles~~`);
  const [isRecording, setIsRecording] = useState(false);
  const [mainText, setMainText] = useState(``);
  const subText = transcriber.transcript;

  async function toggleRecording() {
    transcriber.toggleTranscription();
    setIsRecording((cur) => !cur);
    if (!isRecording) {
      postCreateNote(subText).then((res) => setMainText(res));
    }
  }

  return (
    <>
      <div className="h-[50vh] sm:text-2xl text-xl w-full lg:w-2/5">
        <Markdown remarkPlugins={[remarkGfm]}>{mainText}</Markdown>
        <Markdown
          className={`${subtextFont.className} inline`}
          remarkPlugins={[remarkGfm]}
        >
          {subText}
        </Markdown>
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
