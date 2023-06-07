import { TabsActions, TabsState } from "./types.ts";
export const tabsReducer = (
  state: TabsState,
  { type, payload }: TabsActions,
) => {
  switch (type) {
    case "@@UPDATE_TAB": {
      const newState = {
        ...state,
        tabs: {
          ...state.tabs,
          [payload.tabSlug]: {
            ...state.tabs[payload.tabSlug],
            [payload.key]: payload.value,
          },
        },
      };

      return newState;
    }

    case "@@UPDATE_ACTIVE_TAB": {
      return {
        ...state,
        activeTab: payload.tabSlug,
      };
    }

    default:
      return state;
  }
};
