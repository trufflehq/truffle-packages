import { React } from "../../deps.ts";
import { ThemeMap } from "../../shared/mod.ts";

import {
  DrLupoStJudePageTheme,
  onPageCleanup as onDrLupoStJudePageThemeCleanup,
} from "../drlupo-stjude-theme/drlupo-stjude-theme.tsx";
import {
  onPageCleanup as onScuffedWorldTourThemeCleanup,
  ScuffedWorldTourPageTheme,
} from "../scuffed-world-tour-theme/scuffed-world-tour-theme.tsx";
import {
  LudwigTarikPageTheme,
  onPageCleanup as onLudwigTarikThemeCleanup,
} from "../ludwig-tarik-theme/ludwig-tarik-theme.tsx";
import {
  LacsPageTheme,
  onPageCleanup as onLacsThemeCleanup,
} from "../lacs-theme/lacs-theme.tsx";
import {
  TerroriserPageTheme,
  onPageCleanup as onTerroriserThemeCleanup,
} from "../terroriser-theme/terroriser-theme.tsx";
import { AlertTheme } from "../alert-theme/alert-theme.tsx";

export const ALERT_PAGE_THEMES: ThemeMap = {
  "drlupo-stjude": {
    Component: DrLupoStJudePageTheme,
    onCleanup: onDrLupoStJudePageThemeCleanup,
  },
  "scuffed-world-tour-theme": {
    Component: ScuffedWorldTourPageTheme,
    onCleanup: onScuffedWorldTourThemeCleanup,
  },
  "ludwig-tarik-theme": {
    Component: LudwigTarikPageTheme,
    onCleanup: onLudwigTarikThemeCleanup,
  },
  "lacs-theme": {
    Component: LacsPageTheme,
    onCleanup: onLacsThemeCleanup,
  },
  "terroriser-theme": {
    Component: TerroriserPageTheme,
    onCleanup: onTerroriserThemeCleanup,
  },
};

function PageTheme(
  { themes = ALERT_PAGE_THEMES, alertTypes = ["drlupo-stjude"] }: {
    themes?: ThemeMap;
    alertTypes?: string[];
  },
) {
  return <AlertTheme themes={themes} alertTypes={alertTypes} />;
}

export default PageTheme;
