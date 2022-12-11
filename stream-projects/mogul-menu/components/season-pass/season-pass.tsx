import {
  _,
  classKebab,
  createSubject,
  cssVars,
  getSrcByImageObj,
  gql,
  ImageByAspectRatio,
  React,
  useEffect,
  useMemo,
  useObservables,
  useQuery,
  useRef,
  useStyleSheet,
  zeroPrefix,
} from "../../deps.ts";

import { isNative, useOwnedCollectibleConnection } from "../../shared/mod.ts";
import { useDialog } from "../base/dialog-container/dialog-service.ts";

import UnlockedEmoteDialog from "../dialogs/unlocked-emote-dialog/unlocked-emote-dialog.tsx";
import RedeemableDialog from "../dialogs/redeemable-dialog/redeemable-dialog.tsx";
import ItemDialog from "../dialogs/item-dialog/item-dialog.tsx";

import AccountAvatar from "../account-avatar/account-avatar.tsx";
import { useCurrentTab } from "../tabs/mod.ts";
import Dialog from "../base/dialog/dialog.tsx";
import Button from "../base/button/button.tsx";

import styleSheet from "./season-pass.scss.js";
import Reward from "../season-pass-reward/season-pass-reward.tsx";
import { LockedIcon } from "../locked-icon/locked-icon.tsx";
import MultiRewardLevelUpDialog from "../dialogs/multi-reward-level-up-dialog/multi-reward-level-up-dialog.tsx";
import SingleRewardLevelUpDialog from "../dialogs/single-reward-level-up-dialog/single-reward-level-up-dialog.tsx";
import { OrgUserCounter, SeasonPass as SeasonPassType } from "../../types/mod.ts";
import { useSeasonPassData } from "./hooks.ts";

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      name
      email
      phone
    }
  }
`;

export function getLevelBySeasonPassAndXp(seasonPass: SeasonPassType, xp: OrgUserCounter) {
  const currentXp = xp?.count ? xp.count : 0;

  const lastLevel = _.findLast(
    seasonPass.levels,
    ({ minXp }) => currentXp >= minXp,
  );

  return lastLevel;
}

export function getXPBarBySeasonPassAndXp(seasonPass: SeasonPassType, xp: OrgUserCounter) {
  const currentXp = xp?.count ? parseInt(xp.count) : 0;

  const floor = _.findLast(seasonPass.levels, ({ minXp }) => currentXp >= minXp) ?? 0;

  const ceiling = _.find(seasonPass.levels, ({ minXp }) => currentXp < minXp);

  if (!ceiling) {
    const ceiling = seasonPass.levels[seasonPass.levels.length - 1];

    const range = parseInt(ceiling?.minXp) -
      parseInt(seasonPass.levels[seasonPass.levels.length - 2].minXp);
    const progress = range;

    return { range, progress };
  }

  const floorMinXp = floor?.minXp ? parseInt(floor?.minXp) : 0;
  const range = parseInt(ceiling?.minXp) - floorMinXp;

  const progress = currentXp - floorMinXp;

  return { range, progress };
}

export default function SeasonPass(props) {
  useStyleSheet(styleSheet);
  const {
    shouldUseCurrentLevelZeroPrefix,
    shouldUseLevelsZeroPrefix,
    premiumAccentColor,
    premiumBgColor = "",
    numTiles = isNative() ? 3 : 4,
    xpImageObj,
  } = props;

  const { pushDialog, popDialog } = useDialog();
  const { setTabBadge } = useCurrentTab();

  const [{ data: meData }] = useQuery({ query: ME_QUERY });
  const me = meData?.me;

  const $$levelsRef = useRef(null);
  const $$levelRef = useRef(null);
  const { focalIndexStream, selectedRewardStream } = useMemo(() => {
    return {
      focalIndexStream: createSubject(0),
      selectedRewardStream: createSubject(),
    };
  }, []);

  const { focalIndex } = useObservables(() => ({
    focalIndex: focalIndexStream.obs,
  }));

  const {
    data: seasonPassData,
    fetching: isFetchingSeasonPass,
    error: seasonPassFetchError,
  } = useSeasonPassData();

  const seasonPass: SeasonPassType = seasonPassData?.seasonPass;
  const { reexecuteOwnedCollectibleConnQuery } = useOwnedCollectibleConnection();

  const currentLevelNum = seasonPass
    ? getLevelBySeasonPassAndXp(seasonPass, seasonPass?.xp)?.levelNum || 0
    : 0;

  const { range, progress } = seasonPass
    ? getXPBarBySeasonPassAndXp(seasonPass, seasonPass?.xp)
    : { range: 0, progress: 0 };

  const tiers = seasonPass?.data?.tiers;

  const levels = seasonPass?.levels;

  const groupedLevels = _.keyBy(seasonPass?.levels, "levelNum");

  // need levels to be sequential from min to max
  const minLevelNum = _.minBy(seasonPass?.levels, "levelNum")?.levelNum;
  const maxLevelNum = _.maxBy(seasonPass?.levels, "levelNum")?.levelNum;

  const endRange = numTiles > maxLevelNum ? numTiles : maxLevelNum;

  const levelRange = _.range(minLevelNum, endRange + minLevelNum);

  useEffect(() => {
    if (currentLevelNum && numTiles) {
      if (currentLevelNum < numTiles) {
        focalIndexStream.next(0);
      } else if (currentLevelNum + numTiles - 1 > levelRange?.length) {
        focalIndexStream.next(levelRange?.length - numTiles);
      } else {
        focalIndexStream.next(currentLevelNum - 1);
      }
    }
  }, [currentLevelNum]);

  const onLeftClick = () => {
    if (focalIndex - numTiles < 0) {
      focalIndexStream.next(0);
    } else {
      focalIndexStream.next(focalIndex - numTiles);
    }
    selectedRewardStream.next();
  };

  const onRightClick = () => {
    if (focalIndex + numTiles * 2 > levelRange?.length) {
      focalIndexStream.next(levelRange?.length - numTiles);
    } else {
      focalIndexStream.next(focalIndex + numTiles);
    }
    selectedRewardStream.next();
  };

  // TODO: detect when user levels up
  useEffect(() => {
    if (!_.isEmpty(seasonPass?.seasonPassProgression?.changesSinceLastViewed)) {
      reexecuteOwnedCollectibleConnQuery({
        requestPolicy: "network-only",
        additionalTypenames: [
          "Collectible",
          "CollectibleConnection",
          "OwnedCollectible",
        ],
      });
      _.map(
        seasonPass?.seasonPassProgression?.changesSinceLastViewed,
        (change) => {
          setTabBadge(true);

          const hasMultipleRewards = change?.rewards?.length > 1;
          if (hasMultipleRewards) {
            pushDialog(<MultiRewardLevelUpDialog />);
          } else {
            pushDialog({
              isModal: true,
              element: (
                <SingleRewardLevelUpDialog
                  reward={change?.rewards?.[0]}
                  levelNum={change?.levelNum}
                  onClose={() => {
                    popDialog();
                    setTabBadge(false);
                  }}
                />
              ),
            });
          }
        },
      );
    }
  }, [seasonPass?.seasonPassProgression?.changesSinceLastViewed]);

  // since the focal index starts at zero, check if we are at the left boundary
  const isNotLeftClickable = focalIndex - numTiles <= -numTiles;

  // check to see if we are at a right boundary
  const isNotRightClickable = focalIndex + numTiles >= levelRange?.length;

  const isMember = me?.phone || me?.email;

  const visibleLevels = _.slice(levelRange, focalIndex, focalIndex + numTiles);

  const tierNums = _.uniqBy(
    _.flatten(
      _.map(seasonPass?.levels, (level) => _.map(level?.rewards ?? [], "tierNum")),
    ),
  );

  const userTierNum = seasonPass?.seasonPassProgression?.tierNum;
  const xpSrc = xpImageObj
    ? getSrcByImageObj(xpImageObj)
    : "https://cdn.bio/assets/images/features/browser_extension/xp.svg";

  return (
    <div className="c-browser-extension-season-pass">
      {seasonPass && (
        <>
          <div className="top-info">
            <div className="left">
              {
                <>
                  <div className="account">
                    <AccountAvatar size="72px" />
                  </div>
                  <div className="level-progress">
                    <div className="xp">
                      <div className="icon">
                        <ImageByAspectRatio
                          imageUrl={xpSrc}
                          aspectRatio={1}
                          widthPx={24}
                          height={24}
                        />
                      </div>
                      <div className="amount">{`${progress}/${range}`}</div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="filler"
                        style={{
                          width: `calc(${(progress / range) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="level">
                      {`Level ${
                        shouldUseCurrentLevelZeroPrefix
                          ? zeroPrefix(currentLevelNum)
                          : currentLevelNum
                      }`}
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
          {true && (
            <div className="pages">
              <div
                className={`button left ${
                  classKebab({
                    isDisabled: isNotLeftClickable,
                  })
                }`}
                onClick={onLeftClick}
              >
                ◂
              </div>
              <div className="days">
                {`Ends in ${seasonPass?.daysRemaining} days`}
              </div>
              <div
                className={`button right ${
                  classKebab({
                    isDisabled: isNotRightClickable,
                  })
                }`}
                onClick={onRightClick}
              >
                ▸
              </div>
            </div>
          )}
          <div className="action-levels-wrapper">
            <div
              className="levels-wrapper"
              ref={$$levelsRef}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {tiers?.length
                ? (
                  <div className="tier-info">
                    {_.map(tiers, (tier) => {
                      console.log("tier", tier);
                      return (
                        tier?.name && (
                          <div
                            className="tier"
                            style={{
                              background: tier?.background,
                            }}
                          >
                            {tier?.name}
                          </div>
                        )
                      );
                    })}
                  </div>
                )
                : null}
              <div
                className="levels"
                style={{
                  // 165 is in the css. we should probably make a prop and css var in here
                  gridTemplateColumns: `repeat(${numTiles}, 1fr)`,
                }}
              >
                {_.map(visibleLevels, (levelNum) => {
                  return (
                    <$level
                      key={levelNum}
                      abc="def"
                      level={groupedLevels[levelNum]}
                      tierNums={tierNums}
                      userTierNum={userTierNum}
                      tiers={tiers}
                      $$levelRef={$$levelRef}
                      shouldUseLevelsZeroPrefix={shouldUseLevelsZeroPrefix}
                      premiumAccentColor={premiumAccentColor}
                      premiumBgColor={premiumBgColor}
                      selectedRewardStream={selectedRewardStream}
                      currentLevelNum={currentLevelNum}
                      xpRange={range}
                      xpProgress={progress}
                      xpImgSrc={xpSrc}
                      xp={seasonPass?.xp?.count ?? 0}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function $level(props) {
  const {
    level,
    tierNums,
    tiers,
    userTierNum,
    $$levelRef,
    shouldUseLevelsZeroPrefix,
    premiumAccentColor,
    premiumBgColor,
    selectedRewardStream,
    currentLevelNum,
    xp,
    xpImgSrc,
  } = props;

  const isCurrentLevel = currentLevelNum === level?.levelNum;
  const { pushDialog, popDialog } = useDialog();
  const { setActiveTab } = useCurrentTab();

  const { selectedReward } = useObservables(() => ({
    selectedReward: selectedRewardStream.obs,
  }));

  const onRewardClick = (reward, $$rewardRef, tierNum) => {
    if (reward) {
      const isUnlocked = reward && currentLevelNum >= level?.levelNum;
      const isEmote = reward?.source?.type === "emote";
      const isRedeemable = reward?.source?.type === "redeemable";
      const minXp = level?.minXp;
      selectedRewardStream.next({ sourceId: reward?.sourceId, level });
      // this series of if statements categorize different rewards
      // and displays the appropriate dialog for each
      // if the user hasn't unlocked the item yet
      if (!isUnlocked) {
        pushDialog(
          <LockedRewardDialog
            reward={reward}
            xpImgSrc={xpImgSrc}
            minXp={minXp}
            xp={xp}
          />,
        );
        // if the user clicked on an emote
      } else if (isEmote) {
        pushDialog(<UnlockedEmoteDialog reward={reward} />);
        // if the user clicked on a redeemable
      } else if (isRedeemable) {
        pushDialog(<RedeemableDialog redeemableCollectible={reward} />);
      } else {
        pushDialog(
          <ItemDialog
            displayMode="center"
            imgRel={reward?.source?.fileRel}
            primaryText={`You unlocked a ${reward?.source?.name}`}
            secondaryText=""
            buttons={[
              {
                text: "Close",
                borderRadius: "4px",
                bg: cssVars.$tertiaryBase,
                textColor: cssVars.$tertiaryBaseText,
                onClick: popDialog,
              },
              {
                text: "View collection",
                borderRadius: "4px",
                style: "primary",
                onClick: () => {
                  popDialog();
                  setActiveTab("collection");
                },
              },
            ]}
            onExit={popDialog}
          />,
        );
      }
    }
  };

  return (
    <div className={`level ${classKebab({ isCurrentLevel })}`} ref={$$levelRef}>
      <div className="number">
        Level {shouldUseLevelsZeroPrefix ? zeroPrefix(level?.levelNum ?? 0) : level?.levelNum ?? 0}
      </div>
      {_.map(tierNums, (tierNum) => {
        const reward = _.find(level?.rewards ?? [], { tierNum });
        const tierName = tiers?.[tierNum];

        const isValidTierNum = userTierNum >= reward?.tierNum;
        const isUnlockedLevel = currentLevelNum >= level?.levelNum;
        const isUnlocked = reward && isValidTierNum && isUnlockedLevel;

        let isRewardSelected;

        if (selectedReward?.level) {
          isRewardSelected = reward &&
            selectedReward?.sourceId === reward.sourceId &&
            selectedReward?.level === level;
        } else {
          isRewardSelected = reward && selectedReward?.sourceId === reward.sourceId;
        }

        return (
          <div
            key={tierNum}
            className={`reward tier-${tierNum} ${
              classKebab({
                isFirstWithTierName: tierNum === tierNums?.length - 1 && Boolean(tierName), // FIXME this is a hack for Faze reverse bp order
                hasTierName: Boolean(tierName),
              })
            }`}
          >
            <Reward
              isSelected={isRewardSelected}
              premiumAccentColor={premiumAccentColor}
              premiumBgColor={premiumBgColor}
              onClick={onRewardClick}
              isUnlocked={isUnlocked}
              reward={reward}
              tierNum={tierNum}
            />
          </div>
        );
      })}
    </div>
  );
}

function NoItemLevelUpDialog({
  $title,
  $children,
  onViewCollection,
  headerText,
  highlightBg,
}) {
  const { popDialog } = useDialog();

  return (
    <div className="c-unlocked-emote-reward-dialog use-css-vars-creator">
      <ItemDialog
        displayMode="center"
        $title={$title}
        $children={$children}
        headerText={headerText}
        highlightBg={highlightBg}
        primaryText="No item for this level"
        buttons={[
          {
            text: "Close",
            borderRadius: "4px",
            bg: cssVars.$tertiaryBase,
            textColor: cssVars.$tertiaryBaseText,
            onClick: popDialog,
          },
        ]}
        onExit={popDialog}
      />
    </div>
  );
}

export function LockedRewardDialog({ reward, xp, minXp, xpImgSrc }) {
  const { popDialog } = useDialog();
  const isEmote = reward?.source?.type === "emote";
  return (
    <div className="c-locked-reward-item-dialog">
      <Dialog
        actions={[
          <Button style="bg-tertiary" onClick={popDialog}>
            Close
          </Button>,
        ]}
      >
        <div className="body">
          <div className="image">
            <img
              src={getSrcByImageObj(reward?.source?.fileRel?.fileObj)}
              width="56"
            />
          </div>
          <div className="info">
            <div className="name">
              <div className="text mm-text-subtitle-1">
                {reward?.source?.name}
              </div>
              <LockedIcon />
            </div>
            <div className="value-container">
              <ImageByAspectRatio
                imageUrl={xpImgSrc}
                aspectRatio={1}
                widthPx={18}
                height={18}
              />
              <div>
                {xp}/{minXp}
              </div>
            </div>
            <div className="description mm-text-body-2">
              {reward?.description ??
                (isEmote &&
                  `Unlock the ${reward?.source?.name} emote to use in chat`)}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
