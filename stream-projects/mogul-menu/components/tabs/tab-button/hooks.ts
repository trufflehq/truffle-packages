import { useContext } from "../../../deps.ts";
import { TabButtonContext } from "./context.ts";
export function useTabButton() {
  const { addButton, removeButton, clearButtons, buttonMap } = useContext(TabButtonContext);

  return {
    addButton,
    removeButton,
    clearButtons,
    buttonMap,
  };
}
