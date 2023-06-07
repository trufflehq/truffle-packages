import { createContext } from "../../deps.ts";
import { useMenuReducer } from "./hooks.ts";

export type MenuStateContext = ReturnType<typeof useMenuReducer>;
export const MenuContext = createContext<MenuStateContext>(undefined!);
