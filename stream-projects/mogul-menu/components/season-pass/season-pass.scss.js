import { scss } from "../../deps.ts";

export default scss`
$rewardHeight: 100px;

$levelNumberLineHeight: 24px;
$levelNumberMarginBottom: 12px;
$rewardInnerGap: 8px;
$rewardInnerGapName: 60px;
$tierBottomMargin: 18px;
$tierInfoHeight: 28px;
$levelPaddingHeight: 16px;

$green: #75DB9E;
$yellow: #EBC564;

@mixin status-icon {
  background: var(--mm-color-bg-secondary);
  padding: 4px;
  border-radius: 4px;

  &.locked {
    border: 1px solid $yellow;
  }

  &.unlocked {
    border: 1px solid $green;
  }
}

.c-browser-extension-season-pass {
  // max-width: 1230px;
  margin-bottom: 36px;
  color: white;
  // padding: 16px;

  >.top-info {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    >.left {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 2;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      width: 100%;

      >.account {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      >.level-progress {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        max-width: 200px;
        height: 100%;
        box-sizing: border-box;
        padding-left: 24px;

        >.xp {
          display: flex;
          justify-content: space-between;
          padding-bottom: 4px;
          font-weight: 500;
          font-size: 12px;
        }

        >.progress-bar {
          width: 100%;
          height: 6px;
          background-color: rgba(var(--primary-base-rgb-csv), 0.21);

          >.filler {
            background-color: $green;
            height: 100%;
          }
        }

        >.level {
          display: flex;
          align-items: flex-end;
          margin-top: 6px;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
          text-transform: uppercase;
          padding-left: 0;
        }
      }
    }

    >.right {
      display: flex;
      flex-direction: column;
      flex: 3;
      width: 100%;

      >.end-time {
        display: flex;
        flex: 1;
        align-items: flex-end;
        font-size: 24px;
        line-height: 20px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.1px;
        margin-bottom: 16px;

        >.highlight {
          display: flex;
          align-items: flex-end;
          height: 100%;
          margin-right: 4px;
          color: var(--mm-color-secondary);
        }
      }
    }
  }

  >.pages {
    display: flex;
    margin-top: 28px;
    // background-color: var(--tertiary-base);
    // TODO add a background secondary css var
    background-color: rgba(22, 31, 44, 1);
    border-radius: 4px;
    align-items: center;
    margin-bottom: 12px;

    >.days {
      display: flex;
      justify-content: center;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      flex: 1;
    }

    >.button {
      color: var(--mm-color-text-bg-primary);
      padding: 10px 16px;
      cursor: pointer;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

      &.is-disabled {
        opacity: 0.6;
        pointer-events: none;
      }
    }
  }

  >.action-levels-wrapper {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: transparent;

    >.actions {
      margin-bottom: 20px;
    }

    >.levels-wrapper {
      justify-content: center;
      position: relative;

      >.tier-info {
        position: absolute;
        pointer-events: none;
        left: -16px;
        right: -16px;
        // TODO: the math for these isn't great
        top: calc(#{$levelPaddingHeight} + 32px + #{$levelNumberMarginBottom});

        >.tier {
          color: var(--mm-color-bg-secondary);
          margin-bottom: calc(#{$rewardHeight} + calc(#{$rewardInnerGapName} / 2) + #{$tierBottomMargin} + 4px);
          font-weight: 600;
          text-transform: uppercase;
          background: var(--mm-color-bg-secondary);
          line-height: $tierInfoHeight;
          padding: 0 28px;
        }
      }

      >.levels {
        display: grid;
        grid-auto-flow: column;
        align-items: stretch;
        grid-gap: 8px;

        >.level {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: $levelPaddingHeight 0;
          border-radius: calc(12px * var(--border-radius-multiplier));

          &.is-locked {
            opacity: 0.5;
          }

          &.is-current-level {
            background: rgba(255, 255, 255, 0.10);
          }

          >.number {
            padding: 0 4px;
            font-weight: 600;
            font-size: 14px;
            line-height: $levelNumberLineHeight;
            vertical-align: middle;
            margin-bottom: $levelNumberMarginBottom;
            text-transform: uppercase;
          }

          >.reward {
            margin-bottom: $rewardInnerGap;
            flex: 1;
            width: 100%;
            height: 120px;
            min-height: 120px;

            &.is-first-with-tier-name {
              margin-top: 52px;
            }

            &.has-tier-name {
              margin-bottom: 60px; // TODO break this into a var
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }

  .actions {
    display: flex;
    position: relative;
    z-index: 1;

    >.action {
      margin-right: 16px;
      color: var(--mm-color-secondary);

      &:last-child {
        margin-right: 0;
      }

      >.c-button {
        font-size: 12px;
        border-radius: calc(4px * var(--border-radius-multiplier));
      }

      &.purchase-premium {
        color: var(--inherit-base);

        >.c-button {
          width: 100%;
          color: var(--inherit-base);
          box-sizing: border-box;
          padding: 20px 16px;
          background: linear-gradient(94.02deg, var(--secondary-base) 0%, var(--primary-base) 100%), var(--secondary-base);
        }
      }
    }
  }

}

.c-positioned-overlay {
  >.content {
    border-radius: 8px;
  }
}

.c-reward-tooltip {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  z-index: 2;
  border-radius: 8px;
  border: 1px solid #FFFFFF;
  background: var(--mm-color-text-bg-primary);
  /* This renders in a portal w/o selected css vars */
  ;
  box-sizing: border-box;


  >.title {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 8px;
    color: var(--mm-color-bg-secondary);
    font-weight: 600;
    width: 100%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    >.thumbnail {
      margin-right: 8px;
      ;
    }
  }

  >.description {
    box-sizing: border-box;
    padding: 12px 12px 16px 12px;
    font-weight: 500;
    font-size: 14px;
    background: var(--mm-color-text-bg-primary);
    /* This renders in a portal w/o selected css vars */
    ;
    height: 100%;
    color: var(--mm-color-bg-secondary);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}



.c-rewards-dialog {
  >.c-dialog {
    >.dialog {
      >.top {
        text-transform: uppercase;
        background: var(--mm-color-primary);
        color: var(--mm-color-text-bg-primary);
      }
    }
  }

  >.c-sheet {
    >.sheet {
      >.inner {
        >.top {
          text-transform: uppercase;
          background: var(--mm-color-primary);
          color: var(--mm-color-text-bg-primary);
        }
      }
    }
  }
}

.c-rewards-dialog_content {
  display: flex;
  flex-direction: column;
  padding: 16px 0 72px 0;
  overflow: auto;

  >.level-rewards {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    >.level {
      display: flex;
      font-size: 40px;
      font-family: var(--mm-font-family);
      line-height: 57px;
      padding: 32px 0;
      text-transform: uppercase;

      >.level-number {
        margin: 0 12px;
      }
    }

    >.message {
      text-transform: uppercase;
      margin-bottom: 32px;
    }

    >.rewards {
      display: grid;
      width: 100%;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, $rewardHeight);
      grid-gap: 16px;
    }
  }
}

.c-transaction-history-dialog {
  >.c-dialog {
    >.dialog {
      >.top {
        background: var(--mm-color-primary);
        color: var(--mm-color-text-bg-primary);
      }
    }
  }

  >.c-sheet {
    >.sheet {
      >.inner {
        >.top {
          background: var(--mm-color-primary);
          color: var(--mm-color-text-bg-primary);
        }
      }
    }
  }
}


.c-transaction-history_content {
  min-height: 400px;
  padding: 0px 16px;
  display: flex;
  flex-direction: column;

  >.empty {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 24px;
    line-height: 40px;
    font-weight: 700;
  }

  >.transaction {
    display: flex;
    padding: 16px 0;
    justify-content: space-between;
    border-bottom: 1px solid var(--mm-color-text-bg-primary);

    >.action {
      display: flex;
      flex-direction: column;

      >.time {
        font-family: var(--mm-font-family);
        color: var(--mm-color-text-bg-primary);
        line-height: 1.23em;
        letter-spacing: 0.37px;
      }
    }

    >.xp {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--mm-color-primary);
      padding-right: 8px;
    }
  }
}

.c-locked-reward-item-dialog {

  .body {
    padding: 0 24px;
    display: flex;
    gap: 16px;

    >.info {

      >div {
        margin-bottom: 2px;
      }

      >.name {
        display: flex;
        align-items: center;
        gap: 8px;

        >.status-icon {
          @include status-icon();
        }
      }

      >.value-container {
        display: flex;
        align-items: center;
        gap: 5px;

        >.value {
          font-weight: 600;
          font-size: 12px;
        }
      }

      >.description {
        font-weight: 400;
        font-size: 14px;
        color: var(--inherit-base-text);
      }
    }
  }
}
`;
