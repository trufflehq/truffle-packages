import { scss } from "../../../deps.ts";

export default scss`
  .c-notification-topic-settings {
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
      }
    }

    .row:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;
