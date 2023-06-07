import { React, useStyleSheet } from "../../deps.ts";
import { Powerup as PowerupType } from "../../types/powerup.types.ts";
import styleSheet from "./powerup.scss.js";

export default function Powerup({
  powerup,
  size = 20,
}: {
  powerup: PowerupType;
  size?: number;
}) {
  useStyleSheet(styleSheet);
  const imageSrc = powerup?.componentRels?.[0].props?.imageSrc;
  if (!imageSrc) return <></>;
  return (
    <div className="c-powerup">
      <img src={imageSrc} width={size} />
    </div>
  );
}
