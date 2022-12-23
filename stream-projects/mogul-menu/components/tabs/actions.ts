import { TabStateKey, TabStateValue, UpdateActiveTabAction, UpdateTabAction } from "./types.ts";

export const updateTabState = (
  tabSlug: string,
  key: TabStateKey,
  value: TabStateValue,
): UpdateTabAction => ({
  type: "@@UPDATE_TAB",
  payload: {
    tabSlug: tabSlug,
    key,
    value,
  },
});

export const setActiveTab = (tabSlug: string): UpdateActiveTabAction => ({
  type: "@@UPDATE_ACTIVE_TAB",
  payload: {
    tabSlug,
  },
});
