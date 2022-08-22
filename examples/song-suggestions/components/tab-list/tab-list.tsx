import { React, TabsPrimitive, useStyleSheet } from '../../deps.ts'
import styleSheet from "./tab-list.scss.js";

type TabListProps = {
  children: React.ReactNode
}

export default function TabList({ children }: TabListProps) {
  useStyleSheet(styleSheet)

  return <TabsPrimitive.List className="c-tab-list">
    {children}
  </TabsPrimitive.List>
}