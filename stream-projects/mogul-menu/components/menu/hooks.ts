import { React, useContext, useMemo, useReducer } from "../../deps.ts";
import { MenuActions, MenuPosition, MenuState } from "./types.ts";
import { DimensionModifiers } from "../draggable/draggable.tsx";
import { getMenuState } from "./getters.ts";
import {
  enqueueSnackBar,
  popSnackBar,
  setClosed,
  setOpen,
  updateDimensions,
  updateMenuPosition,
} from "./actions.ts";
import { MenuContext } from "./context.ts";
import { menuStateReducer } from "./reducer.ts";

export function useMenuReducer(initialState: MenuState) {
  const [state, dispatch] = useReducer(menuStateReducer, initialState);

  const memoizedStore = useMemo<[MenuState, React.Dispatch<MenuActions>]>(() => [state, dispatch], [
    state,
  ]);

  return { state: memoizedStore[0], dispatch: memoizedStore[1] };
}

export function useMenu() {
  const { state, dispatch } = useContext(MenuContext);
  return {
    state,
    dispatch,
    toggleOpen: () => {
      const menuState = getMenuState(state);
      return menuState === "open" ? dispatch(setClosed()) : dispatch(setOpen());
    },
    setIsOpen: () => dispatch(setOpen()),
    setIsClosed: () => dispatch(setClosed()),
    updateDimensions: (mods?: Partial<DimensionModifiers>) => dispatch(updateDimensions(mods)),
    enqueueSnackBar: (snackbar: React.ReactNode) => dispatch(enqueueSnackBar(snackbar)),
    popSnackBar: () => dispatch(popSnackBar()),
    updateMenuPosition: (position: MenuPosition) => dispatch(updateMenuPosition(position)),
  };
}
