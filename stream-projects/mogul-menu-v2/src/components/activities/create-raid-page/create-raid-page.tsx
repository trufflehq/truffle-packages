import { React } from "../../../deps.ts";
import RaidCreatedSnackbar from "../raid-created-snackbar/raid-created-snackbar.tsx";
import CreateAlertPage from "../create-alert-page/create-alert-page.tsx";
export default function CreateRaidPage() {
  return (
    <CreateAlertPage
      type="raid-stream"
      pageTitle="Start a raid"
      pageDescription="Send viewers to a video, streamer, or site after your stream ends"
      titleLabel="Raid title"
      titlePlaceholder={`Add a title like \"Check out this video\"`}
      descriptionLabel="Raid description"
      descriptionPlaceholder={"Write a description that will get viewers excited about the raid"}
      createButtonTitle="Start raid"
      alertCreatedSnackbar={<RaidCreatedSnackbar />}
    />
  );
}
