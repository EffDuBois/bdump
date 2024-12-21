"use client";
import AlertProvider from "@/services/AlertProvider";
import StoreProvider, { useStore } from "@/services/store/provider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AlertProvider>
      <StoreProvider>
        {/* <FileDrawer
            currentNote={store.currentNote}
            setCurrentNote={store.setCurrentNote}
          /> */}
        {children}
      </StoreProvider>
    </AlertProvider>
  );
};
export default Providers;
