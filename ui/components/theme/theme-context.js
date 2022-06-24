import { createContext, useContext } from "https://npm.tfl.dev/react";

export const ThemeContext = createContext();

export function useThemeContext() {
  return useContext(ThemeContext);
}
