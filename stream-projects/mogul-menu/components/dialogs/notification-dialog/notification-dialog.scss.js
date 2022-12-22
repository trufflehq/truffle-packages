import { scss } from "../../../deps.ts";

export default scss`
.c-browser-extension-notification-dialog {

  .body {
    padding: 20px 26px;

    > .transaction {
      display: flex;
      box-sizing: border-box;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);

      > .info {
        display: flex;
        flex-direction: column;

        > .name {
          font-size: 14px;
          line-height: 21px;
          color: var(--mm-color-text-bg-secondary);
        }

        > .date {
          font-size: 12px;
          line-height: 18px;
          color: rgba(255, 255, 255, 0.64);
        }
      }

      > .score {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex:1;

        > .amount {
          margin-right: 6px;
          font-size: 14px;
          line-height: 21px;
        }
      }
    }
  }
}
`;
