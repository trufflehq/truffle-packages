import { classKebab, getSrcByImageObj, React, useRef, useStyleSheet } from "../../deps.ts";
import { UnlockedIcon } from "../unlocked-icon/unlocked-icon.tsx";
import { LockedIcon } from "../locked-icon/locked-icon.tsx";

import styleSheet from "./season-pass-reward.scss.js";
import { SeasonPassLevelReward } from "../../types/season-pass.types.ts";

export default function Reward({
  isSelected,
  onClick,
  reward,
  tierNum,
  background = "var(--mm-color-bg-primary)",
  accentColor = "var(--mm-color-primary)",
  isUnlocked,
}: {
  isSelected?: boolean;
  onClick?: (
    reward: SeasonPassLevelReward<any>,
    ref: any,
    tierNum: number,
  ) => void;
  reward: SeasonPassLevelReward<any>;
  tierNum?: number;
  background?: string;
  accentColor?: string;
  isUnlocked: boolean;
}) {
  useStyleSheet(styleSheet);

  const $$ref = useRef();

  const rewardAmountValue = reward?.amountValue;

  return (
    <div
      className={`c-reward ${
        classKebab({
          isSelected,
          isClickable: Boolean(onClick),
        })
      }`}
      ref={$$ref}
      onClick={(e) => {
        onClick?.(reward, $$ref, tierNum);
      }}
      style={{
        "--accent-color": accentColor,
        "--background": background,
      }}
    >
      <div className="status-icon">
        {reward && (isUnlocked ? <UnlockedIcon /> : <LockedIcon />)}
      </div>
      <div className="inner">
        {reward?.source?.fileRel?.fileObj && (
          <div className="image">
            <img src={getSrcByImageObj(reward?.source.fileRel.fileObj)} />
          </div>
        )}
        <div className="name">
          {rewardAmountValue
            ? `x${rewardAmountValue} ${reward?.source?.name}`
            : reward?.source?.name}
        </div>
      </div>
    </div>
  );
}
