import { PartialBy } from "@/utils/custom_types";

export interface Note {
  id: number;
  file_name: string;
  file_path: string;
  transcript: string;
  content: string;
  embedding?: Float32Array;
}

export interface AskData {
  query: string;
  response: string;
}

export enum DBs {
  notes = "NotesDB",
}

export enum Stores {
  notes = "Notes",
}
