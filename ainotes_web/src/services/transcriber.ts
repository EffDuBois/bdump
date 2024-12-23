"use client";
import { createClient, ListenLiveClient, LiveSchema } from "@deepgram/sdk";
import { useEffect, useState } from "react";
import { modeType } from "@/app/page";
import { valueOrActionFunction } from "./store/provider";

type connectionStatusType =
  | "connecting"
  | "connected"
  | "transmitting"
  | "disconnected";

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DEEPGRAM_MODEL_CONFIG: LiveSchema = {
  model: "nova-2",
  smart_format: true,
  language: "hi",
};

const useTranscriber = (updateFunction: valueOrActionFunction<string>) => {
  const [connectionStatus, setConnectionStatus] =
    useState<connectionStatusType>("connecting");
  const [recording, setRecording] = useState(false);

  const [mic, setMic] = useState<MediaRecorder>();
  const [socket, setSocket] = useState<ListenLiveClient>();

  const createSocket = (): Promise<ListenLiveClient> => {
    return new Promise((resolve) => {
      const deepgram = createClient(DEEPGRAM_API_KEY);
      const newSocket = deepgram.listen.live(DEEPGRAM_MODEL_CONFIG);

      let keepAlive;
      if (keepAlive) clearInterval(keepAlive);

      keepAlive = setInterval(() => {
        // console.log("KeepAlive sent.");
        newSocket.keepAlive();
      }, 5000);

      newSocket.on("open", async () => {
        console.log("client: connected to deepgram Socket");
        setConnectionStatus("connected");
        resolve(newSocket);

        newSocket.on("Results", async (data) => {
          setConnectionStatus("transmitting");
          setInterval(() => {
            setConnectionStatus("connected");
          }, 1000);
          const transcript = data.channel.alternatives[0].transcript;
          if (transcript !== "") {
            console.log("server:" + transcript);
            updateFunction((old) => old + " " + transcript);
          }
        });

        newSocket.on("error", (e) => {
          console.error(e);
          setConnectionStatus("disconnected");
        });

        newSocket.on("warning", (e) => console.warn(e));
        newSocket.on("Metadata", (e) => console.log(e));
        newSocket.on("close", (e) => {
          setConnectionStatus("disconnected");
          console.log("Socket Closed");
        });
      });
    });
  };

  useEffect(() => {
    let currentSocket: ListenLiveClient;
    createSocket().then((socket) => {
      currentSocket = socket;
      setSocket(socket);
    });
    return () => {
      currentSocket?.requestClose();
      setSocket(undefined);
    };
  }, []);

  const toggleTranscription = async () => {
    try {
      if (!recording) {
        console.log("trying to start recording");
        const newMic = await getMic();
        setMic(newMic);
        if (newMic) {
          if (socket) {
            startMic(newMic, socket);
            setRecording(true);
          } else {
            console.error("Socket not initialised");
          }
        } else {
          console.error("Can't initialise mic");
        }
      } else {
        if (mic) {
          console.log("Stop Recording");
          setRecording(false);
          mic.stop();
          setMic(undefined);
        } else {
          console.error("Microphone not initialized");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { recording, toggleTranscription, connectionStatus };
};

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
    console.log("client: sent data to webSocket");
    socket.send(data);
  };
};

export default useTranscriber;
