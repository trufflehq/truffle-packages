import { React } from "../../deps.ts";
import { ThemeMap } from "../../shared/mod.ts";

import {
  DrLupoStJudePageTheme,
  onPageCleanup as onDrLupoStJudePageThemeCleanup,
} from "../drlupo-stjude-theme/drlupo-stjude-theme.tsx";
import {
  ScuffedWorldTourPageTheme,
  onPageCleanup as onScuffedWorldTourThemeCleanup,
} from "../scuffed-world-tour-theme/scuffed-world-tour-theme.tsx";
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
