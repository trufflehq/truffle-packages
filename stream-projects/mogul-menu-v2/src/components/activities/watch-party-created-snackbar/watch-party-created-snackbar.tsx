import { React } from "../../../deps.ts";
import { DISCO_BALL_PATH } from "../../../shared/mod.ts";
import ActivityCreatedSnackbar from "../activity-created-snackbar/activity-created-snackbar.tsx";

export default function WatchPartyCreatedSnackbar() {
  return (
    <ActivityCreatedSnackbar
      activityType="Watch Party"
      icon={DISCO_BALL_PATH}
      color="#71DBDB"
      iconViewBox={24}
    />
  );
}
