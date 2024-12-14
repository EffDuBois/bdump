"use client";
import { createContext, useContext } from "react";
import store from "./actions";

const defaultStore = store();
export const Store = createContext(defaultStore);

export const useStore = () => {
  const contextStore = useContext(Store);

  if (!contextStore) throw new Error("Critical error: store missing");
  return contextStore;
};
