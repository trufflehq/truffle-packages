import React, { createContext } from "https://npm.tfl.dev/react";

export const Context = createContext();

export default function FormControl({ isInvalid, children }) {
  return (
    <Context.Provider value={{ isInvalid }}>
      {children}
    </Context.Provider>
  );
}
