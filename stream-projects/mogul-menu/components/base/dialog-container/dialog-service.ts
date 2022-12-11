import { React, signal } from "../../../deps.ts";

interface DialogStackItem {
  element: React.ReactNode;
  isModal: boolean;
}

export const dialogStack$ = signal<DialogStackItem[]>([]);
export function useDialog() {
  return {
    pushDialog: (nextDialog: DialogStackItem | React.ReactNode) => {
      if (isDialogStackItem(nextDialog)) {
        dialogStack$.set((currentStack) => currentStack.concat(nextDialog));
      } else {
        dialogStack$.set((currentStack) =>
          currentStack.concat({ element: nextDialog, isModal: false })
        );
      }
    },
    popDialog: () => {
      dialogStack$.set((currentStack) => currentStack.slice(0, -1));
    },
  };
}

function isDialogStackItem(item: DialogStackItem | React.ReactNode): item is DialogStackItem {
  return Boolean((item as DialogStackItem).element && (item as DialogStackItem).isModal);
}
