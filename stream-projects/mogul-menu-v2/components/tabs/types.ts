import { React } from "../../deps.ts";

export interface TabProps {
  tabId: string;
}

export type TabElement = (props: TabProps) => React.ReactNode;

export interface TabDefinition {
  text: string;
  slug: string;
  imgUrl: string;
  $el?: TabElement;
  hasBadge?: boolean;
}

export interface TabState {
  hasBadge: boolean;
  text: string;
  icon: string;
  isActive: boolean;
}

export type TabStateValue = TabState[keyof TabState];
export type TabStateKey = keyof TabState;
export type TabStateMap = Record<string, TabState>;

export type UpdateTabAction = {
  type: "@@UPDATE_TAB";
  payload: {
    tabSlug: string;
    key: TabStateKey;
    value: TabStateValue;
  };
};

export type UpdateActiveTabAction = {
  type: "@@UPDATE_ACTIVE_TAB";
  payload: {
    tabSlug: string;
  };
};
export type TabsActions = UpdateTabAction | UpdateActiveTabAction;

export type TabsMap = Record<string, TabState>;

export type TabsState = {
  activeTab: string;
  tabs: TabsMap;
};
