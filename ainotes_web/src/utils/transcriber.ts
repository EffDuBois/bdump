"use client";
import { createClient, ListenLiveClient } from "@deepgram/sdk";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

function useTranscriber(setTranscript: Dispatch<SetStateAction<string>>) {
  const [recording, setRecording] = useState(false);
  const [mic, setMic] = useState<MediaRecorder>();

  const socket = useMemo(() => {
    const deepgram = createClient(DEEPGRAM_API_KEY);
    let keepAlive;

    const socket = deepgram.listen.live({
      model: "nova",
      smart_format: true,
    });

    if (keepAlive) clearInterval(keepAlive);
    keepAlive = setInterval(() => {
      console.log("KeepAlive sent.");
      socket.keepAlive();
    }, 5000);

    socket.on("open", async () => {
      console.log("client: connected to deepgram socket");
      socket.on("Results", (data) => {
        console.log(data);
        const transcript = data.channel.alternatives[0].transcript;
        if (transcript !== "") setTranscript((old) => old + transcript);
      });
      socket.on("error", (e) => console.error(e));
      socket.on("warning", (e) => console.warn(e));
      socket.on("Metadata", (e) => console.log(e));
      socket.on("close", (e) => {
        console.log(e);
      });
    });
    return socket;
  }, []);

  const toggleTranscription = async () => {
    if (!recording) {
      console.log("Start Recording");
      let newMic: MediaRecorder;
      if (mic) {
        newMic = mic;
      } else {
        newMic = await getMic();
        setMic(newMic);
      }
      if (newMic && socket) {
        startMic(newMic, socket);
        setRecording(true);
      } else {
        console.log("mic not initialised");
      }
    } else {
      if (mic) {
        console.log("Stop Recording");
        setRecording(false);
        mic.stop();
      } else {
        console.error("Microphone not initialized");
      }
    }
  };

  return { toggleTranscription };
}

const getMic = async () => {
  const userMedia = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  console.log("mic created");
  return new MediaRecorder(userMedia);
};

const startMic = async (mic: MediaRecorder, socket: ListenLiveClient) => {
  mic.start(250);
  mic.onstart = () => {
    console.log("client: microphone opened");
  };

  mic.onstop = () => {
    console.log("client: microphone closed");
  };

  mic.ondataavailable = (e) => {
    const data = e.data;
    console.log("client: sent data to websocket");
    socket.send(data);
  };
};

export default useTranscriber;
