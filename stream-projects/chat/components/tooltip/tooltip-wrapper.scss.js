import { scss } from "../../deps.ts";

export default scss`
.truffle-tooltip-wrapper {
  display: inline-block;
  position: relative;

  &:hover {
    > .truffle-tooltip {
      display: flex;
      flex-direction: column;
    }
  }

  > .truffle-tooltip {
    padding: 3px 6px;
    border-radius: 0.4rem;
    background-color: var(--mm-tooltip-bg);
    color: var(--mm-tooltip-text-color);
    display: none;
    position: absolute;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    z-index: 2000;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    gap: 2px;
    margin-bottom: 6px;

    &.is-top {
      top: auto;
      bottom: 100%;
      left: 0;
      margin-bottom: 6px;

      &.is-align-center {
        left: 50%;
        transform: translateX(-50%);
      }

      &.is-align-left {
        left: -3%;
      }
    }

    &.is-bottom {
      top: 100%;
      bottom: auto;
      left: 0;
      margin-bottom: 6px;

      &.is-align-center {
        left: 50%;
        transform: translateX(-50%);
      }

      &.is-align-left {
        left: -3%;
      }
    }
  }
}
`