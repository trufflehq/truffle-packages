import { scss } from "../../../../deps.ts";

export default scss`
.c-create-collectible-page {
  .container {
    max-width: 980px;
    margin: 80px auto;

    .page-title {
      font-style: normal;
      font-weight: 600;
      font-size: 28px;
    }

    > div:not(:last-child) {
      margin-bottom: 40px;
    }
  }
}
`;
