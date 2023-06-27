import { scss } from "../../../deps.ts";

export default scss`
.c-select-outcome-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;

  .body {
    > .question {
      background: var(--mm-color-bg-tertiary);
      font-size: 18px;
      font-weight: 600;
      line-height: 27px;
      text-align: center;
      padding: 12px 0;
      margin-top: 12px;
    }

    > .options {
      display: flex;
      flex-direction: column;
      padding: 20px 24px;
      gap: 12px;

      > .option {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        cursor: pointer;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        box-sizing: border-box;
        &.is-selected {
          border-radius: 4px;

          > .color {
            border-top: 1px solid var(--mm-color-text-bg-primary);
            border-left: 1px solid var(--mm-color-text-bg-primary);
            border-bottom: 1px solid var(--mm-color-text-bg-primary);
          }

          > .text {
            border-top: 1px solid var(--mm-color-text-bg-primary);
            border-right: 1px solid var(--mm-color-text-bg-primary);
            border-bottom: 1px solid var(--mm-color-text-bg-primary);
          }
        }

        &:hover {
          filter: brightness(0.9);
        }

        > .color {
          width: 40px;
          height: 100%;
          border-top: 1px solid transparent;
          border-left: 1px solid transparent;
          border-bottom: 1px solid transparent;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          box-sizing: border-box;
        }

        > .text {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 12px;
          height: 100%;
          box-sizing: border-box;
          font-weight: 700;
          font-size: 14px;
          line-height: 17px;
          box-sizing: border-box;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          border-right: 1px solid rgba(255, 255, 255, 0.16);
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }

    > .footer {
      display: flex;
      justify-content: flex-end;
      padding: 20px 24px 24px 24px;

      > .error {
        margin-right: 8px;
        font-size: 12px;
        line-height: 14px;
        font-weight: 400;
        color: var(--error-red);
      }
    }
  }
}

.c-winner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #EBAD64;
  font-size: 14px;
  font-weight: 500;
}
`;
