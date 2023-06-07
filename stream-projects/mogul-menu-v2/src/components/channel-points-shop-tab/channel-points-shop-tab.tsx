import { React, useStyleSheet } from "../../deps.ts";
import ChannelPointsShop from "../channel-points-shop/channel-points-shop.tsx";

import styleSheet from "./channel-points-shop-tab.scss.js";

export default function ChannelPointsShopTab(props) {
  useStyleSheet(styleSheet);
  // const channelPointsSrc = channelPointsImageObj
  //   ? getSrcByImageObj(channelPointsImageObj)
  //   : "https://cdn.bio/assets/images/features/browser_extension/channel-points.svg";
  const channelPointsSrc =
    "https://cdn.bio/assets/images/features/browser_extension/channel-points.svg";

  const onHowToEarnClick = () => {
    // overlay.open(() => (
    //   <ChannelPointsActionsDialog channelPointsSrc={channelPointsSrc} />
    // ));
  };

  return (
    <div className="c-channel-points-shop-tab">
      <ChannelPointsShop />
    </div>
  );
}
