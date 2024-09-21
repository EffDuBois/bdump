import { Note } from "./data";

export const getTitle = (note: Note) => {
  return note.path.replace(/^.*[\\/]/, "");
};
