import { scss } from "../../../deps.ts";

export default scss`
.c-raid-overlay {
  background-color: #1f1f1f;
  border-radius: 4px;
  z-index: 49;
  margin: auto;
  width: 80vw;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-family: 'Inter';

  > .iframe-container {
    height: 50vh;
    iframe {
      width: 100%;
      height: 100%;
    }
  }

  > .body-container {
    // width: 100%;
    text-align: center;

    > .raid-title {
      color: #ffffff;
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 12px;
      margin-top: 20px;

    }

    > .description {
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
      margin-bottom: 32px;
    }

    > .button-container {
      display: flex;
      justify-content: center;
      padding: 0;
      margin-bottom: 45px;
      gap: 16px;
    }
  }
}
`;
