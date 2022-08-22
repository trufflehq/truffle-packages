import { React, useStyleSheet } from "../../deps.ts";
import { Powerup } from "../../types/powerup.types.ts";
import styleSheet from "./flair.scss.js";

export default function Flair({
  powerups,
  size = 20,
}: {
  powerups: Powerup[];
  size?: number;
}) {
  useStyleSheet(styleSheet);
  return (
    <div className="c-flair">
      {powerups?.map((powerup) => (
        powerup.componentRels?.[0]?.props?.imageSrc ? <img src={powerup.componentRels?.[0]?.props?.imageSrc} width={size} /> : null
      ))}
    </div>
  );
}
