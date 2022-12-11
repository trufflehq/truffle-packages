import { scss } from "../../deps.ts";

export default scss`
.c-delete-dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;

  .body {
    > .icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      > .title {
        margin-top: 12px;
        font-size: 16px;
        font-weight: 600;
        line-height: 19px;
      }
    }

    .error {
      text-align: center;
      margin-top: 8px;
      margin-right: 8px;
      font-size: 12px;
      line-height: 14px;
      font-weight: 400;
      color: var(--error-red);
    }

    > .footer {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      padding: 24px;
      box-sizing: border-box;
      gap: 12px;

      > .c-button {
        flex: 1;
      }
    }
  }
}
`;
