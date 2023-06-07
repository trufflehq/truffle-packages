import { React } from "../../../deps.ts";
import { CRYSTAL_BALL_ICON } from "../../../shared/mod.ts";
import ActivityCreatedSnackbar from "../activity-created-snackbar/activity-created-snackbar.tsx";

export default function PredictionCreatedSnackbar() {
  return (
    <ActivityCreatedSnackbar
      activityType="Prediction"
      icon={CRYSTAL_BALL_ICON}
      color="#AF7AF2"
      iconViewBox={20}
    />
  );
}
