import CreateCollectibleForm from "../create-collectible-form/create-collectible-form.tsx";
import { enableLegendStateReact, React, toDist, useStyleSheet } from "../../deps.ts";
import styleSheet from "./create-collectible-page.scss.js";

enableLegendStateReact();

export default function CreateCollectiblePage() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-create-collectible-page">
      <div className="container">
        <div className="page-title">Create do-something collectible</div>
        <CreateCollectibleForm />
      </div>
    </div>
  );
}
