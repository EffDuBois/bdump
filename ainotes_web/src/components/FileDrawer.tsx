"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import AppTitle from "./branding/AppLogo";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getEmptyNote } from "@/services/database/dbUtils";
import { useEffect, useState } from "react";
import { Note } from "@/services/database/dataModels";
import { deleteNote, fetchAllNotes } from "@/services/database/idbService";

const FileDrawer = () => {
  const router = useRouter();
  const currentNoteId = Number(useParams().id);

  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = () => {
    console.log("fetching notes");
    fetchAllNotes()
      .then((notes) => {
        setNotes(notes);
      })
      .catch((error) => console.error("Failed to fetch notes:", error));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    const note = await getEmptyNote();
    if (note) {
      router.push(`/notes/${note.id}`);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarHeader>
        <Button onClick={createNote}>Add Note</Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col">
            {notes.map((note) => (
              <SidebarMenuItem key={note.id}>
                <SidebarMenuButton
                  isActive={currentNoteId === note.id}
                  onClick={() => {
                    if (currentNoteId !== note.id) {
                      router.push(`/note/${note.id}`);
                    }
                  }}
                >
                  <span>{note.file_name ? note.file_name : "New Note"}</span>
                </SidebarMenuButton>

                <SidebarMenuAction onClick={() => deleteNote(note.id)}>
                  <X />
                  <span className="sr-only">Delete Note</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default FileDrawer;
