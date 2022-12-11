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
  const themeProps = typeof window !== 'undefined' && window.location.href.includes('new.ludwig.social') ? {
    colorPrimary: "#F5C973",
    colorSecondary: "#F5CC76",
    gradient: "linear-gradient(282.52deg, #E35923 6.5%, #EA7723 42.22%, #F5CC76 99.17%)"
  } : {}
  return (
    <>
      <MenuProvider {...props}>
        <ThemeComponent {...themeProps} />
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
