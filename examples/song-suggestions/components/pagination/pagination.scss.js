import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.pagination-container {
  display: flex;
  list-style-type: none;

  .pagination-item {
    padding: 0 12px;
    height: 32px;
    text-align: center;
    margin: auto 4px;
    color: var(--tfl-color-on-bg-fill);
    display: flex;
    box-sizing: border-box;
    align-items: center;
    letter-spacing: 0.01071em;
    border-radius: 16px;
    line-height: 1.43;
    font-size: 13px;
    min-width: 32px;

    &.dots:hover {
      background-color: transparent;
      cursor: default;
    }
    &:hover {
      background-color: var(--tfl-color-primary-fill-hovered);
      cursor: pointer;
    }

    &.selected {
      background-color: var(--tfl-color-primary-fill-pressed);
    }

    .arrow {
      &::before {
        position: relative;
        /* top: 3pt; Uncomment this to lower the icons as requested in comments*/
        content: '';
        /* By using an em scale, the arrows will size with the font */
        display: inline-block;
        width: 0.4em;
        height: 0.4em;
        border-right: 0.12em solid var(--tfl-color-on-bg-fill);
        border-top: 0.12em solid var(--tfl-color-on-bg-fill);
      }

      &.left {
        transform: rotate(-135deg) translate(-50%);
      }

      &.right {
        transform: rotate(45deg);
      }
    }

    &.disabled {
      pointer-events: none;

      .arrow::before {
        border-right: 0.12em solid rgba(255, 255, 255, 0.43);
        border-top: 0.12em solid rgba(255, 255, 255, 0.43);
      }

      &:hover {
        background-color: transparent;
        cursor: default;
      }
    }
  }
}
`