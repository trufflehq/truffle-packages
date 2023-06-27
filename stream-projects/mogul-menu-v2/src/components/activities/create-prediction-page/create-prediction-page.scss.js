import { scss } from "../../../deps.ts";

export default scss`
.c-create-prediction-page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0px 72px 24px 72px;

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  > .error {
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--error-red);
  }
}

.c-create-poll-options {
  display: flex;
  flex-direction: column;
  margin-top: 32px;

  > .options {
    display: flex;
    flex-direction: column;
    gap: 12px;

    margin-top: 24px;
  }
  
  .add-option {
    display: flex;
    justify-content: center;
  }
}

.c-submission-period {
  display: flex;
  flex-direction: column;
  margin-top: 24px;

  > .duration {
    margin-top: 24px;
  }
}

.c-poll-option-input {
  display: flex;
  position: relative;

  > .block {
    width: 40px;
    height: 40px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  > .close {
    position: absolute;
    right: 12px;
    top: 10px;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

}

.c-number-input {
  display: flex;
  flex-direction: column;
  flex: 1;
 
  
  &.has-suffix {
    .c-legend-input {
      > input {
        height: 100%;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: none;
      }
    }
  }

  &.has-error {
    .suffix {
      border: 1px solid var(--error-red);
    }
  }
    
  .label {
    display: flex;
    flex: 1;
    font-size: 15px;
    font-weight: 500;
    color: 'white';
    user-select: 'none';
    margin-bottom: 8px;
  }

  > .input {
    display: flex;
    flex: 1;
    max-width: 142px;
    height: 40px;
    box-sizing: border-box;

    > .suffix {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px 16px;
      background-color: var(--mm-color-bg-tertiary);
      box-sizing: border-box;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  > .error {
    font-size: 14px;
    color: var(--error-red);
    font-weight: 400;

    margin-top: 8px;
  }
}

`;
