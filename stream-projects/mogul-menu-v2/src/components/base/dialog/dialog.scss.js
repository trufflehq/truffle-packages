import { scss } from "../../../deps.ts";

export default scss`
.c-dialog {
  background: var(--mm-color-bg-secondary);
  color: var(--mm-color-text-bg-secondary);
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 90% !important;

  @media (min-width: 600px) {
    width: 424px !important;
  }

  > .flex {
    display: flex;
    flex-direction: column;
    overflow: auto;
    width: 100%;


    > .content {
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: auto;
      overflow: auto;
    }

    > .top-actions {
      background: var(--background);
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      align-items: center;
      padding: 12px 16px;

      .close {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        outline: none;

        &:focus {
          border: 2px solid var(--border-color);
        }

        &:active {
          border: 2px solid var(--border-color);
        }
      }
    }

    > .bottom-actions {
      display: flex;
      gap: 12px;
      padding: 24px;
      flex-shrink: 0;

      &.fill {
        > * {
          flex: 1;
        }
      }

      &.left {
        justify-content: flex-start;
      }

      &.right {
        justify-content: flex-end;
      }
    }
  }
}
`;
