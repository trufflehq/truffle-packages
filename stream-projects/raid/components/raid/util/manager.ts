import { setRaidPersistenceState } from "./persistence.ts";
import { setShowingStyles, setHiddenStyles } from "./display.ts";
import { raidState$ } from "./state.ts";

/**
 * Sets the persistence state and hides the raid using jumper.
 * @param id
 */
export function hideRaid(id?: string) {
  raidState$.set({
    id,
    isShowing: false,
  });
  setRaidPersistenceState(id, false);
  setHiddenStyles();
}

/**
 * Sets the persistence state and shows the raid using jumper.
 * @param id
 */
export function showRaid(id?: string) {
  raidState$.set({
    id,
    isShowing: true,
  });
  setRaidPersistenceState(id, true);
  setShowingStyles();
}
