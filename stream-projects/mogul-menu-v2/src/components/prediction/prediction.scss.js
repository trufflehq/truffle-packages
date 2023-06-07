import { scss } from "../../deps.ts";

export default scss`
.c-prediction {
  color: white;
  display: flex;
  flex-direction: column;
  padding-bottom: 72px;
  box-sizing: border-box;

  .question-banner {
    text-align: center;
    
    padding: 0 64px;
    
    @media (min-width: 768px) {
      padding:  0;
    }

  
    .question {
      font-weight: 600;
      font-size: 20px;
      line-height: 30px;
      margin-bottom: 2px;
    }
  
    .status {
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
  
      .winner {
        text-transform: uppercase;
        font-weight: 600;
        font-size: 16px;
        line-height: 19px;
      }
    }
  }

  > .options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: stretch;
    padding: 0 64px;
    box-sizing: border-box;
    gap: 32px;
    margin-top: 24px;
  }
}

.c-prediction-option {
  min-width: 0;
  display: flex;
  flex-direction: column;

  grid-column: span 2;

  @media (min-width: 768px) {
    grid-column: span 1;
  }
  
  > .name {
    font-weight: 600;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--option-color);
  }

  > .tile {
    padding: 20px 24px;
    box-sizing: border-box;
    border: 1px solid var(--option-color);
    border-radius: 8px;

    > .stats {
      display: grid;
      grid-template-columns: auto 1fr;
      position: relative;
      flex-grow: 1;
  
      > .percentage {
        grid-column: 1 / span 2;
        justify-self: center;
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 20px;
        text-align: center;
      }
 
      > .label {
        justify-self: end;
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
        text-align: right;
        color: var(--option-color);
      }
  
      > .value {
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
      }
  
      > .label:not(:last-child) {
        margin-bottom: 12px;
      }
  
      > .vote {
        grid-column: 1 / span 2;
  
        > button {
          width: 100%;
  
          .vote-button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
          }
        }
      }
  
      .loading {
        grid-column: 1 / span 2;
        text-align: center;
      }
    }
  }

  > .input {
    margin-top: 12px;

    .error {
      margin-top: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      color: var(--error-red);
    }
  }

  > .my-vote {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }
}

.c-vote-amount-input {
  display: flex;
  background-color: var(--mm-color-bg-tertiary);
  border-radius: 4px;
  position: relative;

  &.is-disabled {
    filter: brightness(60%);
  }

  > .vote-button {
    background: var(--mm-color-bg-tertiary);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    
    transition: unset !important;

    &:focus, &:active {
      outline: none;
    }

    &.is-active {
      border-top: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);

      background: var(--border-color);

      &:focus, &:active {
        outline: 2px solid var(--mm-color-primary);
        outline-offset: 2px;
      }
    }

    &:disabled {
      filter: unset;
    }
  }

  .c-legend-input {
    > input {
      padding-left: 44px;
      border-left: 1px solid var(--border-color);
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      border-right: 1px solid var(--mm-color-bg-tertiary);
      border-top-right-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }

  .c-channel-points-icon {
    position: absolute;
    left: 12px;
    top: 10px;
  }
}

.c-prediction-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--mm-color-bg-tertiary);
  border-radius: 8px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    width: 400px;
  }


  > .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 21px;
  }

  > .message {
    display: flex;
    align-items: center;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;

    > .amount {
      display: flex;
      align-items: center;
      margin-right: 4px;
      gap: 2px;
    }
  }
}
`;
