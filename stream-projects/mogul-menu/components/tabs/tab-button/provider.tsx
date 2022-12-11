import { React, useState } from "../../../deps.ts";
import { TabButtonContext } from "./context.ts";

export function TabButtonProvider({ children }: { children: React.ReactNode }) {
  const [buttonMap, setButtonMap] = useState<Record<string, React.ReactNode>>({});

  const addButton = (key: string, Component: React.ReactNode) => {
    setButtonMap((oldButtonMap) => ({
      ...oldButtonMap,
      [key]: Component,
    }));
  };

  const removeButton = (key: string) => {
    setButtonMap((oldButtonMap) => {
      const newButtonMap = { ...oldButtonMap };
      delete newButtonMap[key];

      return newButtonMap;
    });
  };

  const clearButtons = () => {
    setButtonMap({});
  };

  return (
    <TabButtonContext.Provider
      value={{
        addButton,
        removeButton,
        clearButtons,
        buttonMap,
      }}
    >
      {children}
    </TabButtonContext.Provider>
  );
}
