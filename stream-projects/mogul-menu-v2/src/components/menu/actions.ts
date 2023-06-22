import { React } from "../../deps.ts";
import {
  CloseMenuAction,
  EnqueueSnackbarAction,
  MenuPosition,
  OpenMenuAction,
  PopSnackbarAction,
  UpdateMenuPosition,
} from "./types.ts";

export const setOpen = (): OpenMenuAction => ({
  type: "@@MENU_DEMENSION_OPEN",
  payload: {},
});

export const setClosed = (): CloseMenuAction => ({
  type: "@@MENU_DIMENSION_CLOSE",
  payload: {},
});

export const enqueueSnackBar = (
  snackbar: React.ReactNode,
): EnqueueSnackbarAction => ({
  type: "@@MENU_ENQUEUE_SNACKBAR",
  payload: {
    snackbar,
  },
});

export const popSnackBar = (): PopSnackbarAction => ({
  type: "@@MENU_POP_SNACKBAR",
  payload: {},
});

export const updateMenuPosition = (
  position: MenuPosition,
): UpdateMenuPosition => ({
  type: "@@MENU_UPDATE_POSITION",
  payload: {
    position,
  },
});
