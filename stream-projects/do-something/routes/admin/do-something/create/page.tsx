import CreateCollectibleForm from "../../../../components/create-collectible-form/create-collectible-form.tsx";
import { enableLegendStateReact, React, toDist, useStyleSheet } from "../../../../deps.ts";
import styleSheet from "./page.scss.js";

enableLegendStateReact();

function CreateCollectiblePage() {
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

export default toDist(CreateCollectiblePage, import.meta.url);
