import { scss } from "../../../deps.ts";

export default scss`
.c-continue-as-page{
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  flex: 1;

  @media (min-width: 768px) {
    padding: 32px;
  }

  > .logo {
    width: 96px;
    height: 96px;
    margin: 0 auto;
    background-size: 100%;
    background-repeat: no-repeat;
  }

  > .title {
    font-size: 24px;
    font-weight: 700;
    margin-top: 32px;
  }

  > .description {
    font-size: 18px;
    font-weight: 400;
    margin-top: 12px;
  }

  > .button {
    margin-top: 32px;
  }
}`;
