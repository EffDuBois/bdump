import { useEffect, useState } from "react";
import { Note } from "../database/dataModels";

import { postCreateNote } from "@/apis/postCreateNote";
import postQueryNote from "@/apis/postQueryNote";
import useDbService from "../database/idbService";

const storeActions = () => {
  const notesDb = useDbService();
  const { storeNote, deleteNote, putNote } = notesDb;

  const [notes, setNotes] = useState<Note[]>([]);
  const [notesFetchStatus, setNoteFetchStatus] = useState(true);
  useEffect(() => {
    //Fetching notes
    setNoteFetchStatus(true);
    if (notesDb.dbStatus && !notesDb.dbWriteStatus) {
      notesDb.fetchAllNotes().then((notes) => setNotes(notes));
    }
    setNoteFetchStatus(false);
  }, [notesDb.dbStatus, notesDb.dbWriteStatus]);

  const createNote = async (query: string, currentNote?: Partial<Note>) => {
    try {
      const newNote = await postCreateNote(query);
      notesDb.putNote({
        id: currentNote?.id,
        file_name: currentNote?.file_name || newNote.title,
        path: newNote.path || currentNote?.path,
        content: newNote.body,
        embedding: newNote.embedding,
      });
      return newNote;
      //new note
    } catch (error) {
      //#todo add a pop up
      console.error(error);
    }
  };

  const queryNotes = async (query: string) => {
    const queryResponse = await postQueryNote({
      query,
      data: notes.filter(
        (note): note is Note & { embedding: Float32Array<ArrayBufferLike> } =>
          note.embedding !== undefined
      ),
    });
    return queryResponse;
  };

  return {
    notes,
    notesFetchStatus,
    createNote,
    storeNote,
    putNote,
    deleteNote,
    queryNotes,
  };
};
export default storeActions;
