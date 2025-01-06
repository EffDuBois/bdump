"use client";
import FileDrawer from "@/components/FileDrawer";
import TopBar from "@/components/TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/ui/ThemeProvider";
import { Toaster } from "sonner";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <Toaster />
        <FileDrawer />
        <div className="flex flex-col flex-1">
          <TopBar />
          {children}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};
export default Providers;
