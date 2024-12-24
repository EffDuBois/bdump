"use client";

import { useStore } from "@/services/store/provider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import AppTitle from "./AppTitle";

const FileDrawer = () => {
  const store = useStore();
  return (
    <Sidebar>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarHeader>
        <Button onClick={store.initCurrentNote}>Add Note</Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col">
            {!store.notesFetchStatus ? (
              store.notes.map((note) => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton
                    isActive={store?.currentNote?.id === note.id}
                    onClick={() => {
                      if (store.currentNote?.id !== note.id) {
                        store.setCurrentNote(note);
                      }
                    }}
                  >
                    <span>{note.file_name ? note.file_name : "New Note"}</span>
                  </SidebarMenuButton>
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
