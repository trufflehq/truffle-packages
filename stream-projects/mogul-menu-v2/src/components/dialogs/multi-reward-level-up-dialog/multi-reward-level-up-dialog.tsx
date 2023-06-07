import { React } from "../../../deps.ts";
import Dialog from "../../base/dialog/dialog.tsx";
import DefaultDialogContentFragment from "../content-fragments/default/default-dialog-content-fragment.tsx";

export default function MultiRewardLevelUpDialog() {
  return (
    <Dialog>
      <DefaultDialogContentFragment
        primaryText="Woah there!"
        secondaryText="Looks like you've encountered an unfinished feature! Don't worry, the devs will get on this soon :p"
      />
    </Dialog>
  );
}
