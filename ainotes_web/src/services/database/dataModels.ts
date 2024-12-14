import { PartialBy } from "@/utils/custom_types";

export interface Note {
  id: number;
  file_name: string;
  path: string;
  transcript: string;
  content: string;
  embedding?: Float32Array;
}

export enum DBs {
  notes = "NotesDB",
}

export enum Stores {
  notes = "Notes",
}
