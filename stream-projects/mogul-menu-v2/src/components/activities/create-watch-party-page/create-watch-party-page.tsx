import { React } from "../../../deps.ts";
import WatchPartyCreatedSnackbar from "../watch-party-created-snackbar/watch-party-created-snackbar.tsx";
import CreateAlertPage from "../create-alert-page/create-alert-page.tsx";
export default function CreateWatchPartyPage() {
  return (
    <CreateAlertPage
      type="watch-party"
      pageTitle="Start watch party"
      pageDescription="Watch a video with chat before streams"
      titleLabel="Party title (opt)"
      titlePlaceholder=""
      descriptionLabel="Party description (opt)"
      descriptionPlaceholder=""
      createButtonTitle="Start watch party"
      alertCreatedSnackbar={<WatchPartyCreatedSnackbar />}
    />
  );
}
