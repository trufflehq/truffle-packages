import { React, toDist } from '../../deps.ts'
import PollOverlay from "../../components/poll-overlay/poll-overlay.tsx";

function PollOverlayPage() {
  return (
    <div className="p-poll-overlay-page">
      <PollOverlay />
    </div>
  );
}

export default toDist(PollOverlayPage, import.meta.url);
