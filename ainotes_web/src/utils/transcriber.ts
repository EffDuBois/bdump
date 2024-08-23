"use client";
import { createClient, ListenLiveClient } from "@deepgram/sdk";
import { Dispatch, SetStateAction, useState } from "react";
const deepgramKey = process.env.DEEPGRAM_API_KEY;

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

function useTranscriber(placeholder: string) {
  const [transcript, setTranscript] = useState(placeholder);
  const [recording, setRecording] = useState(false);
  const [mic, setMic] = useState<MediaRecorder>();

  const deepgram = createClient(deepgramKey);
  const socket = deepgram.listen.live({
    model: "nova",
    smart_format: true,
  });
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
    socket.on("close", (e) => console.log(e));
  });

  const toggleTranscription = async () => {
    if (!recording) {
      console.log("Start Recording");
      setRecording(true);
      const newMic = await getMic();
      setMic(newMic);
      startMic(newMic, socket);
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
  return { toggleTranscription, transcript };
}

export default useTranscriber;
