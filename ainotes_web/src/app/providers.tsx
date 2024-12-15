"use client";
import DbProvider from "@/services/database/Provider";
import StoreProvider from "@/services/store/storeProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DbProvider>
      <StoreProvider>{children}</StoreProvider>
    </DbProvider>
  );
};
export default Providers;
