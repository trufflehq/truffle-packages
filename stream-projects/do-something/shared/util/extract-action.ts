import { Alert } from "../types/alert.ts";
import { Action } from "../types/action.ts";

export function extractAction(alert: Alert<Action>): Action {
  return {
    user: alert.data.user,
    collectible: alert.data.collectible,
    time: new Date(alert.time),
  };
}
