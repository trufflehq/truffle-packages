import { _, React, useStyleSheet } from "../../deps.ts";
import { ActivePowerup } from "../../types/active-powerup.types.ts";
import Powerup from "../powerup/powerup.tsx";
import styleSheet from "./active-powerups.scss.js";

export default function ActivePowerups({
  activePowerups,
  size,
}: {
  activePowerups: ActivePowerup[];
  size?: number;
}) {
  useStyleSheet(styleSheet);
  return (
    <div className="c-active-powerups">
      {_.map(
        _.take(
          _.filter(
            activePowerups,
            ({ powerup }: ActivePowerup) =>
              powerup?.componentRels?.[0]?.props?.imageSrc,
          ),
          1,
        ),
        (activePowerup: ActivePowerup) => (
          <Powerup powerup={activePowerup?.powerup} size={size} />
        ),
      )}
    </div>
  );
}
