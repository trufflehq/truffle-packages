import { React, TabsPrimitive, useStyleSheet } from '../../deps.ts'
import styleSheet from "./tab-panel.scss.js";

type TabPanelProps = {
  children: React.ReactNode
  value: string
}

export default function TabPanel({ children, value }: TabPanelProps) {
  useStyleSheet(styleSheet)

  return <TabsPrimitive.Content className="c-tab-content" value={value}>
    {children}
  </TabsPrimitive.Content>
}