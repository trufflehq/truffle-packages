import { createContext } from "../../deps.ts";
import { ActionBannerMap } from "./types.ts";

export interface ActionBannerContext {
  actionBannerMap: ActionBannerMap;
  displayActionBanner: (
    actionBanner: React.ReactNode,
    key?: string,
  ) => string | undefined;
  removeActionBanner: (id: string) => void;
}

export const ActionBannerContext = createContext<ActionBannerContext>(
  undefined!,
);
