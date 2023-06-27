import { scss } from "../../deps.ts";

export default scss`
.c-prediction-tile {

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 16px;

    >.primary-text {
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.005em;
    }

    >.secondary-text {
      font-weight: 500;
      font-size: 12px;
      letter-spacing: 0.004em;
    }
  }
}
`;
