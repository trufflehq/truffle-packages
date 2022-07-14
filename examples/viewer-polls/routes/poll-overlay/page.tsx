import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^1.0.0/format/wc/index.ts";
import PollOverlay from "../../components/poll/poll-overlay/poll-overlay.tsx";
function PollOverlayPage() {
  return (
    <div className="p-poll-overlay-page">
      <PollOverlay pollId={""} />
    </div>
  );
}

export default toDist("react", PollOverlayPage, import.meta.url);
