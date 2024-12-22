"use client";
import FileDrawer from "@/components/FileDrawer";
import { SidebarProvider } from "@/components/ui/sidebar";
import AlertProvider from "@/hooks/AlertProvider";
import StoreProvider from "@/services/store/provider";
import { ThemeProvider } from "@/ui/ThemeProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AlertProvider>
          <SidebarProvider>
            <FileDrawer />
            {children}
          </SidebarProvider>
        </AlertProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};
export default Providers;
