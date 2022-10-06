/**
 * These methods store the showing/hidden state of specific raids by id
 * in local storage.
 */

import { jumper } from "../../../deps.ts";

const RAID_STATES_KEY = "raid:states";

type RaidPersistenceObject = Record<string, boolean>;

export async function setRaidPersistenceState(id: string, state: boolean) {
  const persistedRaids = await getPersistedRaids();
  persistedRaids[id] = state;
  jumper.call("storage.set", {
    key: RAID_STATES_KEY,
    value: JSON.stringify(persistedRaids),
  });
}

export async function getPersistedRaids(): Promise<RaidPersistenceObject> {
  const storageValue = await jumper.call("storage.get", {
    key: RAID_STATES_KEY,
  });
  const persistedRaids = storageValue ? JSON.parse(storageValue) : {};
  return persistedRaids;
}

export async function isPersistedRaidShowing(id: string): Promise<boolean> {
  const persistedRaids = await getPersistedRaids();
  // if there is no entry in storage, we want to default to true
  // because in that case we assume that the user has not seen the raid
  const isShowing = persistedRaids[id] ?? true;
  return isShowing;
}
