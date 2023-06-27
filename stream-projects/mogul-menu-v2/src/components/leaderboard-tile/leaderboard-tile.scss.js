import { scss } from "../../deps.ts";

export default scss`
@mixin username-tooltip {
  .username {
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 2px 10px;
    background-color: var(--mm-color-bg-secondary);
    border: 1px solid var(--mm-color-bg-tertiary);
    border-radius: 4px;
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.004em;
    visibility: hidden;
  }

  &:not(:hover) {
    border-color: transparent !important;
  }

  &:hover {
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    > .username {
      visibility: visible;
    }
  }
}

.c-leaderboard-tile {
  > .inner {
    > .content {
      padding: 14px 21px;
      display: flex;
      gap: 20px;
      justify-content: space-between;
      max-width: 250px;
      margin: 0 auto;

      > .contestant {
        position: relative;

        > .avatar {
          border-radius: 100%;
          border-width: 1px;
          border-style: solid;
          box-sizing: border-box;
          margin-bottom: 4px;

          @include username-tooltip;
        }

        > .rank {
          font-weight: 500;
          font-size: 12px;
          text-align: center;
          letter-spacing: 0.004em;
        }
      }
    }
  }
}
`;
