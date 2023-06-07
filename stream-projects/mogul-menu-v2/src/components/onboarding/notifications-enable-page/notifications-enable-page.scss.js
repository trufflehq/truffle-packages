import { scss } from "../../../deps.ts";

export default scss`
  .c-notifications-enable-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .enable-text {
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      /* or 140% */

      text-align: center;
      letter-spacing: 0.0025em;
      margin-bottom: 40px;
    }

    .actions {
      display: flex;
      gap: 20px;

      > button {
        width: 160px;
        height: 48px;
      }
    }
  }
`;
