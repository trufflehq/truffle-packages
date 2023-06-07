import { React } from "../../deps.ts";
import { useTabsReducer } from "./hooks.ts";
import { TabsContext, TabSlugContext } from "./context.ts";
import { TabDefinition } from "./mod.ts";

export function TabsProvider(
  { tabs, children }: { tabs?: TabDefinition[]; children: React.ReactNode },
) {
  if (!tabs) return <></>;

  const tabStateManager = useTabsReducer(tabs);
  return (
    <TabsContext.Provider value={tabStateManager}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabSlugProvider(
  { children, tabSlug }: { children: React.ReactNode; tabSlug: string },
) {
  return (
    <TabSlugContext.Provider value={tabSlug}>
      {children}
    </TabSlugContext.Provider>
  );
}
