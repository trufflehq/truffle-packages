import { useEffect, useState, usePollingQuery } from "../../../deps.ts";
import { previewSrc as getPreviewSrc } from "../../../shared/util/stream-plat.ts";
import { RAID_QUERY } from "../gql/raid.gql.ts";
import {
  hideRaid as hideRaidOverlay,
  showRaid as showRaidOverlay,
} from "./manager.ts";
import { isPersistedRaidShowing } from "./persistence.ts";

const RAID_DATA_POLL_INTERVAL = 5000;

/**
 *  This function checks to see what the persistence state of a particular
 *  raid is from local storage and sets the visibility of the ui using jumper accordingly.
 * @param id - The id of the raid to ckeck persistence for.
 */
export function useRaidPersistence(id: string) {
  const [isShowing, setIsShowing] = useState(false);

  const hideRaid = (id: string) => {
    setIsShowing(false);
    hideRaidOverlay(id);
  };

  const showRaid = (id: string) => {
    setIsShowing(true);
    showRaidOverlay(id);
  };

  useEffect(() => {
    // if we haven't loaded the id yet,
    // then hide the raid
    if (!id) {
      hideRaid(id);
      return;
    }

    let idChanged = false;
    isPersistedRaidShowing(id).then((shouldBeShowing) => {
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

  return { isShowing, hideRaid, showRaid };
}

/**
 * This function interacts with mycelium to get the current raid info.
 */
export function useRaidData() {
  const { data: raidAlertData } = usePollingQuery(RAID_DATA_POLL_INTERVAL, {
    query: RAID_QUERY,
  });
  const raidAlert = raidAlertData?.alertConnection?.nodes?.[0];
  const id = raidAlert?.id;
  const raidData = raidAlert?.data;
  const url = raidData?.url;
  const previewSrc = getPreviewSrc(url);
  const title = raidData?.title;
  const description = raidData?.description;

  return { url, previewSrc, title, description, id };
}
