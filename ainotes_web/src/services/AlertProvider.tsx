import AlertBar from "@/components/AlertBar";
import { createContext, useContext, useState } from "react";

const AlertContext = createContext<(text: string) => void>(() => {});

const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertBarState, setAlertBarState] = useState(false);
  const [alertBarText, setAlertBarText] = useState("");

  const setAlert = (text: string) => {
    setAlertBarState(true);
    setAlertBarText(text);
  };
  return (
    <AlertContext.Provider value={setAlert}>
      {alertBarState && (
        <AlertBar
          text={alertBarText}
          closeAlert={() => setAlertBarState(false)}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
};
export default AlertProvider;

export const useAlert = () => {
  const alertProvider = useContext(AlertContext);
  return alertProvider;
};
