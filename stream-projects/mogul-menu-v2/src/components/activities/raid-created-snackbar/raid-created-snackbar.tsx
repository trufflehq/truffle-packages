import { React } from "../../../deps.ts";
import { PARACHUTE_ICON_PATH } from "../../../shared/mod.ts";
import ActivityCreatedSnackbar from "../activity-created-snackbar/activity-created-snackbar.tsx";

export default function RaidCreatedSnackbar() {
  return (
    <ActivityCreatedSnackbar
      activityType="Raid"
      icon={PARACHUTE_ICON_PATH}
      color="#F86969"
      iconViewBox={24}
    />
  );
}
