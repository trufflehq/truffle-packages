import {
  jumper,
  React,
  TextField,
  useEffect,
  useSelector,
  useSignal,
  useState,
  useStyleSheet,
} from "../../../deps.ts";
import Button from "../../base/button/button.tsx";
import { Page } from "../../page-stack/mod.ts";
import Switch from "../../base/switch/switch.tsx";
import {
  useOrgUserChatSettings,
  useSaveOrgUserSettings,
} from "../../../shared/mod.ts";
import { SnackBar, useSnackBar } from "../../snackbar/mod.ts";
import styleSheet from "./account-details-page.scss.js";

const IS_THEMING_DISABLED_KEY = "isThemingDisabled";

export default function AccountDetailsPage() {
  useStyleSheet(styleSheet);

  const enqueueSnackBar = useSnackBar();

  const [username, setUsername] = useState<string>();
  const [nameColor, setNameColor] = useState<string>();
  const [hasChanged, setHasChanged] = useState(false);

  const { orgUser } = useOrgUserChatSettings();
  useEffect(() => {
    const username = orgUser?.name;
    const nameColor = orgUser?.keyValue?.value;

    setUsername(username);
    setNameColor(nameColor);
  }, [orgUser]);

  const onSaveError = () => {
    enqueueSnackBar(
      <SnackBar
        message="An error occurred while saving :("
        messageBgColor="var(--mm-color-error)"
        messageTextColor="var(--mm-color-text-error)"
      />,
    );
  };

  const onSave = () => {
    enqueueSnackBar(
      <SnackBar message="Your settings have been saved!" />,
    );
    setHasChanged(false);
  };

  const { saveOrgUserSettings } = useSaveOrgUserSettings(onSave, onSaveError);

  const save = async () => {
    if (!hasChanged) return;
    await saveOrgUserSettings(
      orgUser,
      username,
      nameColor,
    );
  };

  const isThemingDisabled$ = useSignal(
    jumper.call("storage.get", {
      key: IS_THEMING_DISABLED_KEY,
    }).then((value) => value === "1"),
  );
  const isThemingDisabled = useSelector(() => isThemingDisabled$.get());

  return (
    <Page title="Account details">
      <div className="c-account-details-page-body">
        <div className="chat-id-heading mm-text-header-caps">Chat identity</div>
        <div className="username-input input">
          <div className="label mm-text-body-2">Username</div>
          <TextField
            onInput={(e) => {
              setHasChanged(true);
              setUsername(e?.target?.value);
            }}
            value={username}
          />
        </div>
        <div className="name-color-input input">
          <div className="label mm-text-body-2">Name color</div>
          <input
            type="color"
            onInput={(e) => {
              setHasChanged(true);
              setNameColor(e?.target?.value);
            }}
            tabIndex={0}
            value={nameColor}
          />
        </div>
        <div className="input">
          <div className="label mm-text-body-2">
            Disable themes (refresh page after changing)
          </div>
          <Switch
            value={isThemingDisabled}
            onChange={(isEnabled: boolean) => {
              jumper.call("storage.set", {
                key: IS_THEMING_DISABLED_KEY,
                value: isEnabled ? "1" : "0",
              });
              setHasChanged(true);
              isThemingDisabled$.set(isEnabled);
            }}
          />
        </div>
        <div className="actions">
          <Button style="primary" isDisabled={!hasChanged} onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </Page>
  );
}
