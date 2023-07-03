import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-giveaway {
  background: #000;
  color: #fff;
  font-family: Roboto;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.20);

  > .header {
    padding: 12px 16px;
    background: #292829;
    color: #F357A1;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    > .title {

    }
    > .close {

    }
  }
  > .content {
    padding: 20px 16px;

    > .loading {
      text-align: center;
    }

    > .success {
      text-align: center;

      > .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 8px;
      }
    }

    > .description {
      font-size: 16px;
      font-family: Roboto;
      font-weight: 500;
      margin-bottom: 24px;
      text-align: center;
    }

    > .form {
      > .label {
        font-size: 14px;
        font-weight: 500;

        > .input {
          border: none;
          outline: none;
          color: #fff;
          font-family: Roboto;
          font-size: 16px;
          background: #1F1F1F;
          display: block;
          padding: 14px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 8px;
        }
      }

      > .button {
        margin-top: 20px;
        background-color: #F357A1;
        color: #fff;
        border: none;
        outline: none;
        border-radius: 4px;
        display: block;
        padding: 14px;
        font-size: 16px;
        font-family: Roboto;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
      }
    }

    > .terms {
      display: block;
      color: rgba(255, 255, 255, 0.70);
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      margin-top: 12px;
      text-decoration: underline;
    }
  }
}
`;
