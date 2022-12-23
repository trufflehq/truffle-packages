import { scss } from "../../deps.ts";

export default scss`
.c-live-info {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid var(--mm-color-bg-tertiary);
  border-radius: 8px;
  margin-bottom: 24px;

  > .header {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    box-sizing: border-box;
    padding: 12px 16px;
    color: var(--mm-color-text-gradient);
    background: var(--background);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  > .info {
    box-sizing: border-box;
    padding: 16px;

    > .message {
      box-sizing: border-box;
      padding: 8px 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
      color: var(--mm-color-text-demphasized);
    }

    > .grid {
      display: grid;
      grid-template-columns: 1fr;
      box-sizing: border-box;
      margin-top: 24px;

      > .timer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        grid-column: span 2;
        font-size: 18px;
        line-height: 21px;
        font-weight: 600;

        > .time {
          order: 2;
        }

        > .title {
          order: 1;
        }
      }
  
      > .claim {
        margin-top: 24px;

        > .timer {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 3px;

          > .time {
            order: 2;
            margin-bottom: -1px;
          }
  
          > .title {
            order: 1;
          }
        }
      }
    }

  }
}
`;
