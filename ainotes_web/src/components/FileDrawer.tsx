"use client";
import { titleFont } from "@/ui/fonts";

import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import { useStore } from "@/services/store/provider";
import Spinner from "./loaders/Spinner";
import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "./ui/sidebar";

const FileDrawer = () => {
  const store = useStore();
  useEffect(() => {
    store.fetchNotes();
    store.initCurrentNote();
  }, [store.notesFetchStatus, store.currentNoteStatus]);
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className={`text-4xl m-6 text-center ${titleFont.className}`}>
          BrainDump
        </h1>
        {/* <SlabButtonOutline
            className="text-center mb-4"
            onClick={addEmptyNote}
          >
            Add Note
          </SlabButtonOutline> */}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroupLabel>Your Notes</SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col">
            {!store.notesFetchStatus ? (
              store.notes.map((note) => (
                <SidebarMenuItem>
                  <SlabButtonWDelete
                    key={note.id}
                    onClick={() => {
                      if (store.currentNote?.id !== note.id) {
                        store.setCurrentNote(note);
                      }
                    }}
                    onClickDelete={() => store.deleteNoteById(note.id)}
                  >
                    {note.file_name ? note.file_name : "New Note"}
                  </SlabButtonWDelete>
                </SidebarMenuItem>
              ))
            ) : (
              <SidebarMenuSkeleton />
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default FileDrawer;
