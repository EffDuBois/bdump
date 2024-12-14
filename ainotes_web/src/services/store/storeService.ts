import { Note } from "../database/dataModels";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";
import { DbContextType } from "../database/dbProvider";

const storeService = () => {
  const createNote = async (
    db: DbContextType,
    query: string,
    currentNote?: Partial<Note>
  ) => {
    try {
      const createResponse = await postCreateNote(query);
      const dbInput = {
        id: currentNote?.id,
        file_name: currentNote?.file_name || createResponse.title,
        path: createResponse.path || currentNote?.path,
        transcript: currentNote?.transcript || "",
        content: createResponse.body,
        embedding: createResponse.embedding,
      };
      const newNote = await db.putNote(dbInput);
      return newNote;
    } catch (error) {
      //#todo add a pop up
      console.error(error);
    }
  };

  const queryNotes = async (notes: Note[], query: string) => {
    try {
      const queryResponse = await postQueryNote({
        query,
        data: notes.filter(
          (note): note is Note & { embedding: Float32Array<ArrayBufferLike> } =>
            note.embedding !== undefined
        ),
      });
      return queryResponse;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    createNote,
    queryNotes,
  };
};
export default storeService;
