"use client";
import AlertProvider from "@/services/AlertProvider";
import DbProvider from "@/services/database/Provider";
import StoreProvider from "@/services/store/storeProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AlertProvider>
      <DbProvider>
        <StoreProvider>{children}</StoreProvider>
      </DbProvider>
    </AlertProvider>
  );
};
export default Providers;
