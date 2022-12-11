import { createContext } from "../../deps.ts";
import { useTabsReducer } from "./hooks.ts";
export type TabsContext = ReturnType<typeof useTabsReducer>;
export const TabsContext = createContext<TabsContext>(undefined!);

export type TabSlugContext = string
export const TabSlugContext = createContext<TabSlugContext>(undefined!);