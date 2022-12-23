import {
  ImageByAspectRatio,
  React,
  TextField,
  useEffect,
  useSignal,
  useState,
  useStyleSheet,
} from "../../../deps.ts";
import {
  useOrgUserChatSettings,
  useSaveOrgUserSettings,
} from "../../../shared/mod.ts";
import { Page } from "../../page-stack/mod.ts";
import Button from "../../base/button/button.tsx";
import Input from "../../base/input/input.tsx";
import stylesheet from "./chat-settings-page.scss.js";

export default function ChatSettingsPage(
  { onContinue }: { onContinue?: () => void },
) {
  const { orgUser } = useOrgUserChatSettings();
  const username$ = useSignal<string>("");
  const [nameColor, setNameColor] = useState<string>();
  useStyleSheet(stylesheet);

  const { saveOrgUserSettings } = useSaveOrgUserSettings();

  // we want to prepopulate the chat username with the username of the user that was logged in during the prior 3rd party OAuth
  // login step
  useEffect(() => {
    const username = orgUser?.name;
    const nameColor = orgUser?.keyValue?.value;

    username$.set(username);
    setNameColor(nameColor);
  }, [orgUser]);

  const onClick = async () => {
    await saveOrgUserSettings(orgUser, username$.get(), nameColor);
    onContinue?.();
  };

  return (
    <Page isFullSize shouldDisableEscape shouldShowHeader={false}>
      <div className="c-chat-settings-page">
        <div className="hero">
          <ImageByAspectRatio
            imageUrl={"https://cdn.bio/assets/images/features/browser_extension/poggies.png"}
            aspectRatio={1}
            widthPx={60}
            height={60}
          />
          <div className="title">Poggies!</div>
          <div className="welcome">
            {orgUser?.name ? `Welcome, ${orgUser.name}!` : "Welcome!"}
          </div>
          <div className="info">
            Go ahead, change your chat username if you'd like
          </div>
        </div>
        <div className="settings">
          <div className="username">
            <Input
              label="Chat username"
              placeholder="Chat username"
              value$={username$}
            />
          </div>
          <div className="name-color-input input">
            <div className="label mm-text-body-2">Name color</div>
            <input
              type="color"
              onInput={(e) => {
                setNameColor(e?.target?.value);
              }}
              tabIndex={0}
              value={nameColor}
            />
          </div>
        </div>
        <footer className="footer">
          <Button style="primary" shouldHandleLoading onClick={onClick}>
            Continue
          </Button>
        </footer>
      </div>
    </Page>
  );
}
