import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import PremiumContentEmbed from "../components/premium-content-embed/premium-content-embed.tsx";

function EmbedPage() {
  return (
    <PremiumContentEmbed
      url="https://www.patreon.com/theyard/posts"
      title="Ep. 81 Premium - Slime & Aiden Power hour! [VIDEO]"
      previewImageSrc="https://image.mux.com/oyqgHxbgHqIdocoK8201RFIl99sI1VguEfZS02K9XRSv4/thumbnail.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5CY3o3Sk5RcUNmdDdWcmo5MWhra2lEY3Vyc2xtRGNmSU1oSFUzallZMDI0In0.eyJzdWIiOiJveXFnSHhiZ0hxSWRvY29LODIwMVJGSWw5OXNJMVZndUVmWlMwMks5WFJTdjQiLCJleHAiOjE2NzgxMzYwMjgsImF1ZCI6InQiLCJ0aW1lIjoyLjB9.Np1Whqo2olHENx7d6aMp_nTBupttdjvkmaa06gAMAoyigo2yMzyswYsX9WMOigbm9Hzyfq_gtNXhJEL4IBhnOQ7Lq5DpYfOSjtrWZddroSzd9MkhPaXyksfxQ4fF6nOwtmCWkqv2XYgus1Kf5iSAF2yH978VRBbBytlZ7v4MNbHTPMBkxaKbMYHEdZ6K9Hm9NvaC_1IhIzEzGYvkjLhek0bLrzYbj7r7YfmMNcBsXl7wXeQwcedAtheIuzOso9hCTiGfq12EulO9z96vFSpXt5TcLpc50UL3ji2nLzrMgNx-kfgDK-KjN7rwrd-FrvglM8pEmvNHmnaPl1jfK9Jwdw"
    />
  );
}

export default toDist(EmbedPage, import.meta.url);
