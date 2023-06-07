import { TabsState } from "./types.ts";

export function getActiveTab(state: TabsState) {
  return state.activeTab;
}

export function getHasNotification(state: TabsState) {
  return Object.values(state.tabs).reduce(
    (acc, tabState) => acc || tabState.hasBadge,
    false,
  );
}
