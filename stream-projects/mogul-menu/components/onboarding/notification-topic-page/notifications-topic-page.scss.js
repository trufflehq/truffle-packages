import { scss } from "../../../deps.ts";

export default scss`
  .c-notification-topic-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .settings-container {
      margin: 44px 72px;

      .header {
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 28px;
        /* or 140% */

        text-align: center;
        letter-spacing: 0.0025em;
        margin-bottom: 40px;
      }
    }

    .action-container {
      margin: 25px;
      display: flex;
      justify-content: flex-end;
      
      > button {
        width: 150px;
        height: 48px;
      }
    }
  }
`;
