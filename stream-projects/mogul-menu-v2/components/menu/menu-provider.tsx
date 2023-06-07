import { _, React } from "../../deps.ts";
import ThemeComponent from "../../components/base/theme-component/theme-component.tsx";

import { ActionBannerProvider } from "../action-banner/mod.ts";
import { TabButtonProvider, TabsProvider } from "../tabs/mod.ts";
import { MenuProvider } from "./provider.tsx";
import { MogulMenuProps } from "./menu.tsx";

interface MenuProviderProps extends MogulMenuProps {
  children: React.ReactNode;
  [x: string]: unknown;
}

export default function MenuWrapper(props: MenuProviderProps) {
  const { children } = props;
  return (
    <>
      <MenuProvider {...props}>
        <ThemeComponent />
        <TabButtonProvider>
          <TabsProvider tabs={props.tabs}>
            <ActionBannerProvider>
              {children}
            </ActionBannerProvider>
          </TabsProvider>
        </TabButtonProvider>
      </MenuProvider>
    </>
  );
}
