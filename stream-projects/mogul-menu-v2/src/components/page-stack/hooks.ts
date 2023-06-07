import { signal } from "../../deps.ts";

export interface PageState {
  Component: React.ReactNode;
  isEscapeDisabled: boolean;
}

const pageStack$ = signal<PageState[]>([]);

export function usePageStack() {
  return {
    pageStack$,

    pushPage: (PageComponent: React.ReactNode, isEscapeDisabled = false) => {
      pageStack$.set((currentStack) =>
        currentStack.concat({ Component: PageComponent, isEscapeDisabled })
      );
    },

    getTopPage: () => {
      return pageStack$.get()[0];
    },

    popPage: () => {
      pageStack$.set((currentStack) => currentStack.slice(0, -1));
    },

    clearPageStack: () => {
      pageStack$.set([]);
    },
  };
}
