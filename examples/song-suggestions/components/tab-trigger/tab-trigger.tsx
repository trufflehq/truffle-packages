import { React, TabsPrimitive, useStyleSheet } from '../../deps.ts'
import styleSheet from "./tab-trigger.scss.js";

type TabListProps = {
  children: React.ReactNode
  value: string
}

export default function TabTrigger({ children, value }: TabListProps) {
  useStyleSheet(styleSheet)

  return <TabsPrimitive.Trigger className="c-tab-trigger" value={value}>
    {children}
  </TabsPrimitive.Trigger>
}