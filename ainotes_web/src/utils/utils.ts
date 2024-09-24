import { Note } from "./data";

export const getTitleFromPath = (path: string) => {
  return path.replace(/^.*[\\/]/, "");
};
