"use client";
import { titleFont } from "@/ui/fonts";

import SlabButtonWDelete from "@/components/buttons/SlabButtonDelete";
import { useStore } from "@/services/store/provider";
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
        <SidebarGroupLabel>
          Your Notes
        </SidebarGroupLabel>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col">
            {!store.notesFetchStatus ? (
              store.notes.map((note) => (
                <SidebarMenuItem key={note.id}>
                  <SlabButtonWDelete
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
