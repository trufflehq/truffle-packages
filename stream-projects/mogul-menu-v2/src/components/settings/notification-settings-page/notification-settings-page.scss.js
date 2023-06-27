import { scss } from "../../../deps.ts";

export default scss`
.notifications-page-body {
  padding: 24px;

  .push-notifications {
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;

      .input {
        display: inline-block;
        margin: 0 10px;
      }
    }

    .description {
      margin-bottom: 5px;
    }
  }

  .notification-topics {
    .title {
      margin-bottom: 10px;
    }

    .description {
      margin-bottom: 24px;
    }
  }
}
`;
