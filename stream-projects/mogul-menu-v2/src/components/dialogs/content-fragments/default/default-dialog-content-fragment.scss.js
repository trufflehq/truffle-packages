import { scss } from "../../../../deps.ts";

export default scss`
  .c-default-dialog-content-fragment {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    >.image {
      margin-bottom: 16px;
      > img {
        display: block;
      }
    }

    >.secondary-text {
      color: rgb(255, 255, 255, 0.8);
      padding: 2px 20px;
    }
  }
`;
