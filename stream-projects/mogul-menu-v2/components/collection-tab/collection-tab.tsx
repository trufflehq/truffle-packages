import { React, useStyleSheet } from "../../deps.ts";
import Collectibles from "../collectibles/collectibles.tsx";
import styleSheet from "./collection-tab.scss.js";

export default function CollectionTab() {
  useStyleSheet(styleSheet);
  return (
    <div className="c-collection-tab">
      <Collectibles $emptyState={<div>Loading...</div>} />
    </div>
  );
}
