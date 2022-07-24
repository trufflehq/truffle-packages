import { css } from '../../deps.ts';

export default css`
  .c-form-setup {
    border: 1px solid white;
    border-radius: 4px;
    padding: 20px;
    min-width: 400px;
  }

  .c-form-setup > .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .c-form-setup > .form > * {
    max-width: 100%;
  }

  .c-form-setup > .form > .questions-list {
    padding-left: 10px;
  }

  .c-form-setup > .form > .questions-list > .list {
    margin-bottom: 10px;
  }

  .c-form-setup > .form > .questions-list > .list > .question {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    align-items: flex-end;
  }
`