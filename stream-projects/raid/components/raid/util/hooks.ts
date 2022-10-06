import { useEffect } from "../../../deps.ts";
import { hideRaid, showRaid } from "./manager.ts";
import { isPersistedRaidShowing } from "./persistence.ts";

/**
 *  This function checks to see what the persistence state of a particular
 *  raid is from local storage and sets the visibility of the ui using jumper accordingly.
 * @param id - The id of the raid to ckeck persistence for.
 */
export function useRaidPersistence(id: string) {
  useEffect(() => {
    let idChanged = false;
    isPersistedRaidShowing(id).then((shouldBeShowing) => {
      console.log("raid state", id, shouldBeShowing);
      if (!idChanged) {
        if (shouldBeShowing) {
          showRaid(id);
        } else {
          hideRaid(id);
        }
      }
    });

    return () => {
      idChanged = true;
    };
  }, [id]);
}
