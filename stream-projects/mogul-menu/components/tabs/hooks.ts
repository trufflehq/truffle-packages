import {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "../../deps.ts";
import { tabsReducer } from "./reducer.ts";
import { TabDefinition, TabsActions, TabsState, TabState } from "./types.ts";
import { getIsNative, useSeasonPassData } from "../../shared/mod.ts";
import { TabsContext, TabSlugContext } from "./context.ts";
import { CHAT_TAB, DEFAULT_TABS, SEASON_PASS_TAB } from "./constants.ts";

const initializeTabs = (tabs: TabDefinition[]) => {
  const tabStates: Record<string, TabState> = {};
  for (const tab of tabs) {
    tabStates[tab.slug] = {
      text: tab.text,
      icon: tab.imgUrl,
      hasBadge: false,
      isActive: false,
    };
  }

  return { activeTab: "home", tabs: tabStates };
};

export function useTabSlug() {
  return useContext(TabSlugContext);
}

export function useTabsReducer(tabs: TabDefinition[]) {
  const initialTabs = initializeTabs(tabs);

  const [state, dispatch] = useReducer(tabsReducer, initialTabs);

  const memoizedStore = useMemo<[TabsState, React.Dispatch<TabsActions>]>(
    () => [state, dispatch],
    [
      state,
    ],
  );

  return { state: memoizedStore[0], dispatch: memoizedStore[1] };
}

export function useTabs() {
  const { state, dispatch } = useContext(TabsContext);

  return { state, dispatch };
}

export function useCurrentTab() {
  const tabSlug = useTabSlug() as string;
  const { state, dispatch } = useContext(TabsContext);

  const tabStates = state.tabs;

  const currentTabState = tabStates[tabSlug];
  const hasTabNotification = Object.values(tabStates).reduce(
    (acc, tabState) => acc || tabState.hasBadge,
    false,
  );

  return {
    text: currentTabState?.text,
    icon: currentTabState?.icon,
    hasBadge: currentTabState?.hasBadge,
    isActive: currentTabState?.isActive,
    hasTabNotification,
    setTabText: (value: string) =>
      dispatch({
        type: "@@UPDATE_TAB",
        payload: { tabSlug, key: "text", value },
      }),
    setTabIcon: (value: string) =>
      dispatch({
        type: "@@UPDATE_TAB",
        payload: { tabSlug, key: "icon", value },
      }),
    setTabBadge: (value: boolean) =>
      dispatch({
        type: "@@UPDATE_TAB",
        payload: { tabSlug, key: "hasBadge", value },
      }),
    setActiveTab: (tabSlug: string) =>
      dispatch({ type: "@@UPDATE_ACTIVE_TAB", payload: { tabSlug } }),
  };
}

// HACK: only display tabs if the org has the feature associated with it (eg season pass)
// rm when we make users provide their own tab array
export function useDynamicTabs() {
  const [tabs, setTabs] = useState<TabDefinition[]>();
  const hasSetTabsRef = useRef(false);
  const seasonPassRes = null; // # (if re-enabling search for "seasonpassdisabled")
  const isNative = getIsNative();
  useEffect(() => {
    const hasSetTabs = hasSetTabsRef.current;
    if (!hasSetTabs) {
      const fetchingSeasonPass = seasonPassRes?.fetching;
      const readyToSet = !fetchingSeasonPass;

      // when all of the conditionals have loaded,
      // set the tabs
      if (readyToSet) {
        const tabs = [...DEFAULT_TABS];

        // check for the season pass
        const hasSeasonPass = Boolean(seasonPassRes?.data?.seasonPass?.id);
        if (hasSeasonPass) {
          tabs.push(SEASON_PASS_TAB);
        }

        if (isNative || navigator.userAgent?.match(/iP(hone|od|ad)/g)) {
          tabs.splice(1, 0, CHAT_TAB);
        }

        setTabs(tabs);
        hasSetTabsRef.current = true;
      }
    }
  }, [seasonPassRes, isNative]);

  return tabs;
}
