import SeasonPass from "../season-pass/season-pass.tsx";
import LinkButton from "../base/link-button/link-button.tsx";
import { _, React, useStyleSheet } from "../../deps.ts";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import styleSheet from "./season-pass-tab.scss.js";
import XpActionsDialog from "../dialogs/xp-actions-dialog/xp-actions-dialog.tsx";

export default function SeasonPassTab() {
  useStyleSheet(styleSheet);
  const { pushDialog } = useDialog();

  const xpSrc = "https://cdn.bio/assets/images/features/browser_extension/xp.svg";

  const onHowToEarnClick = () => {
    pushDialog(<XpActionsDialog xpSrc={xpSrc} />);
  };
  return (
    <div className="c-season-pass-tab">
      <SeasonPass />
      <div className="mm-text-header-caps title">Earn XP</div>
      <LinkButton className="how-to-earn-link" onClick={onHowToEarnClick}>
        How do I earn XP?
      </LinkButton>
    </div>
  );
}
