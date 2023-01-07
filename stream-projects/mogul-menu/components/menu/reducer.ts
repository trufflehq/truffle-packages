import { MenuActions, MenuState } from "./types.ts";
import { getClosedModifiers, getIsOpen, getOpenModifiers } from "./getters.ts";

// TODO: get rid of all of this. confusing/complex

export const menuStateReducer = (
  state: MenuState,
  { type, payload }: MenuActions,
) => {
  switch (type) {
    case "@@MENU_DEMENSION_OPEN": {
      return {
        ...state,
        menuState: "open",
        dimensions: {
          ...state.dimensions,
          modifiers: {
            ...state.dimensions.modifiers,
            ...getOpenModifiers(state),
          },
        },
      };
    }
    case "@@MENU_DIMENSION_CLOSE": {
      const isOpen = getIsOpen(state);

      return {
        ...state,
        menuState: "closed",
        dimensions: {
          ...state.dimensions,
          modifiers: {
            ...state.dimensions.modifiers,
            ...(isOpen
              ? state.dimensions.modifiers
              : getClosedModifiers(state)),
          },
        },
      };
    }
    case "@@MENU_UPDATE_DIMENSIONS": {
      const isOpen = getIsOpen(state);
      return {
        ...state,
        dimensions: {
          ...state.dimensions,
          modifiers: {
            ...state.dimensions.modifiers,
            ...(isOpen ? getOpenModifiers(state) : getClosedModifiers(state)),
            ...payload,
          },
        },
      };
    }
    case "@@MENU_ENQUEUE_SNACKBAR": {
      const updatedSnackBars = state.snackBars.concat(payload.snackbar);
      return {
        ...state,
        snackBars: updatedSnackBars,
      };
    }
    case "@@MENU_POP_SNACKBAR": {
      const slicedSnackBars = state.snackBars.slice(1);
      return {
        ...state,
        snackBars: slicedSnackBars,
      };
    }
    case "@@MENU_UPDATE_POSITION": {
      if (!payload?.position) return state;
      return {
        ...state,
        menuPosition: payload.position,
      };
    }
    default:
      return state;
  }
};
