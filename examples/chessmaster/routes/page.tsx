import MovePoll from "../components/move-poll/move-poll.tsx";
import PurchaseCollectible from "../components/purchase-collectible/purchase-collectible.tsx";
import { toDist, React } from "../deps.ts";

function HomePage() {

  return (
    <>
      <MovePoll />
      <PurchaseCollectible slug="make-a-move" />
    </>
  );
}

export default toDist(HomePage, import.meta.url);
