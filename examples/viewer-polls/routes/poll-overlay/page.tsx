import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.19/format/wc/react/index.ts";
import PollOverlay from "../../components/poll/poll-overlay/poll-overlay.tsx";
function PollOverlayPage() {
  return (
    <div className="p-poll-overlay-page">
      <PollOverlay />
    </div>
  );
}

export default toDist(PollOverlayPage, import.meta.url);
