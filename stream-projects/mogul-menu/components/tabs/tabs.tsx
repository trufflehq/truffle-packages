import { _, classKebab, React, useEffect, useStyleSheet } from "../../deps.ts";
import {
  DEFAULT_TABS,
  getActiveTab,
  TabSlugProvider,
  updateTabState,
  useTabs,
} from "./mod.ts";
import { usePageStack } from "../page-stack/mod.ts";
import styleSheet from "./tabs.scss.js";
import { TabDefinition } from "./types.ts";

export default function Tabs(
  { tabs = DEFAULT_TABS }: { tabs?: TabDefinition[] },
) {
  useStyleSheet(styleSheet);
  const { state: tabsState, dispatch } = useTabs();
  const tabSlugs = Object.keys(tabsState.tabs);
  const activeTab = getActiveTab(tabsState);
  const { clearPageStack } = usePageStack();
  useEffect(() => {
    clearPageStack();
  }, [activeTab]);

  useEffect(() => {
    dispatch(updateTabState(activeTab, "isActive", true));

    const onNavigateAway = () => {
      dispatch(updateTabState(activeTab, "isActive", false));
    };

    return onNavigateAway;
  }, [activeTab]);

  return (
    <>
      {tabs.map(({ $el: TabComponent }, i) => {
        return (
          <TabSlugProvider key={i} tabSlug={tabSlugs[i]}>
            <div
              className={`c-tab-component ${
                classKebab({
                  isActive: tabSlugs[i] === activeTab,
                })
              }`}
            >
              {TabComponent && <TabComponent />}
            </div>
          </TabSlugProvider>
        );
      })}
    </>
  );
}
