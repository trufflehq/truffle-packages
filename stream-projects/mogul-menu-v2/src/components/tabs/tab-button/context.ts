import { createContext, React } from "../../../deps.ts";

interface TabButtonContext {
  addButton: (key: string, Component: React.ReactNode) => void;
  removeButton: (key: string) => void;
  clearButtons: () => void;
  buttonMap: Record<string, React.ReactNode>;
}
export const TabButtonContext = createContext<TabButtonContext>(undefined!);
