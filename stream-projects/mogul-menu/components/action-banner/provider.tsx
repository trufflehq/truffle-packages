import { React } from "../../deps.ts";
import { ActionBannerContext } from "./context.ts";
import { initActionBanners } from "./hooks.ts";

export function ActionBannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { actionBannerMap, displayActionBanner, removeActionBanner } =
    initActionBanners();

  return (
    <ActionBannerContext.Provider
      value={{ actionBannerMap, displayActionBanner, removeActionBanner }}
    >
      {children}
    </ActionBannerContext.Provider>
  );
}
