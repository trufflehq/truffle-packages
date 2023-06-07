import { React, useStyleSheet } from "../../../deps.ts";
import { Page } from "../../page-stack/mod.ts";
import stylesheet from "./base-page.scss.js";

export default function BasePage() {
  useStyleSheet(stylesheet);

  return (
    <Page isFullSize shouldDisableEscape shouldShowHeader={false}>
      <div className="c-base-page">
      </div>
    </Page>
  );
}
