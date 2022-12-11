import { React } from "../../deps.ts";
import { File } from "../../types/mod.ts";
import { DimensionModifiers } from "../draggable/draggable.tsx";
export type MenuPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface MenuState {
  menuState: string;
  iconImageObj?: File;
  creatorName: string;
  dimensions: {
    base: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    modifiers: Partial<DimensionModifiers>;
  };
  menuPosition?: MenuPosition;
  snackBars: React.ReactNode[];
}

export type OpenMenuAction = {
  type: "@@MENU_DEMENSION_OPEN";
  payload: Record<never, never>;
};

export type CloseMenuAction = {
  type: "@@MENU_DIMENSION_CLOSE";
  payload: Record<never, never>;
};

export type EnqueueSnackbarAction = {
  type: "@@MENU_ENQUEUE_SNACKBAR";
  payload: {
    snackbar: React.ReactNode;
  };
};

export type PopSnackbarAction = {
  type: "@@MENU_POP_SNACKBAR";
  payload: Record<never, never>;
};

export type UpdateDimensionsAction = {
  type: "@@MENU_UPDATE_DIMENSIONS";
  payload?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    transition?: string;
  };
};

export type UpdateMenuPosition = {
  type: "@@MENU_UPDATE_POSITION";
  payload?: {
    position: MenuPosition;
  };
};

export type MenuDimensionActions = OpenMenuAction | CloseMenuAction;

export type MenuActions =
  | MenuDimensionActions
  | UpdateDimensionsAction
  | EnqueueSnackbarAction
  | PopSnackbarAction
  | UpdateMenuPosition;
