import { setRaidPersistenceState } from "./persistence.ts";
import { setShowingStyles, setHiddenStyles } from "./display.ts";

/**
 * Sets the persistence state and hides the raid using jumper.
 * @param id
 */
export function hideRaid(id: string) {
  setRaidPersistenceState(id, false);
  setHiddenStyles();
}

/**
 * Sets the persistence state and shows the raid using jumper.
 * @param id
 */
export function showRaid(id: string) {
  setRaidPersistenceState(id, true);
  setShowingStyles();
}
