import { React, TabsPrimitive, useStyleSheet } from '../../deps.ts'
import styleSheet from "./tabs.scss.js";

type TabsProps = {
  children: React.ReactNode
  defaultValue?: string
}

export default function Tabs({ children, defaultValue }: TabsProps) {
  useStyleSheet(styleSheet)

  return <TabsPrimitive.Root className="c-tabs" defaultValue={defaultValue}>
    {children}
  </TabsPrimitive.Root>
}