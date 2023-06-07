import { scss } from "../../../deps.ts";

export default scss`
.c-confirm-cp-purchase-dialog {

  .body {
    padding: 0 24px;
    display: flex;
    gap: 16px;

    >.info {

      >div {
        margin-bottom: 2px;
      }

      >.name {
        font-weight: 500;
        font-size: 16px;
      }

      >.cost {
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

  .close-button {
    margin-right: 16px;
  }

  .action {
    flex-grow: 1;

    >button {
      border-radius: 4px;
    }
  }
}
`;
