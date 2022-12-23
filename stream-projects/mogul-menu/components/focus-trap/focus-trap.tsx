import { FocusTrap as FocusTrapReact, React } from "../../deps.ts";

export default function FocusTrap({ children }: { children }) {
  return (
    <FocusTrapReact
      focusTrapOptions={{
        clickOutsideDeactivates: true,
      }}
    >
      {children}
    </FocusTrapReact>
  );
}
