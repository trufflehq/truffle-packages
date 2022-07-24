import { css } from "../../deps.ts";

export default css`
  .c-form {
    border: 1px solid white;
    border-radius: 4px;
    padding: 15px;
  }

  .c-form > .name {
    font-size: var(--tfl-font-size-heading-lg);
    font-weight: bold;
  }

  .c-form > .questions > .form-question {
    margin-bottom: 15px;
  }

  .c-form > .questions > .form-question > .question-text {
    font-weight: bold;
  }
`