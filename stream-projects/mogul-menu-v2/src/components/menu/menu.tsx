import { enableLegendStateReact, React } from "../../deps.ts";
import MenuBody from "./menu-body.tsx";
import MenuProvider from "./menu-provider.tsx";
import { File } from "../../types/mod.ts";
import { Vector } from "../draggable/draggable.tsx";
import { TabDefinition, useDynamicTabs } from "../tabs/mod.ts";

enableLegendStateReact();

export interface MogulMenuProps {
  tabs?: TabDefinition[];
  creatorName: string;
  iconImageObj: File;
  defaultPositionElementQuerySelector?: string;
  defaultPositionOffset?: Vector;
}
export default function Menu(props: MogulMenuProps) {
  const tabs = useDynamicTabs();
  // wait until we have loaded the tabs
  if (!tabs) return <></>;

  props = { ...props, tabs };

  return (
    <MenuProvider {...props}>
      <MenuBody
        {...props}
      />
    </MenuProvider>
  );
}
