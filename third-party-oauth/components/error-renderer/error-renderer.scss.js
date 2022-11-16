import { scss } from '../../deps.ts'

export default scss`
.c-error {
  color: var(--tfl-color-on-bg-fill);
  background: var(--tfl-color-bg-fill);
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  > .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: var(--mm-color-bg-secondary);
    padding: 40px;
    font-size: 16px;
    width: 65%;
    margin: 0 auto; 
    line-height: 19px;

    > .title { 
      text-align: center;
      font-size: 20px;
      line-height: 28px;
      font-weight: 700;
    }

    > .message {
      text-align: center;
      font-size: 16px;
      line-height: 24px;
      font-weight: 400;
      margin-top: 8px;
    }

    > .try-again {
      margin-top: 24px;
    }
  }
}

`