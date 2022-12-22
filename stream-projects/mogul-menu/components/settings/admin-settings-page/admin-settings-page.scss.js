import { scss } from "../../../deps.ts";

export default scss`
.c-admin-settings-page-body {
  padding: 24px;

  > .status {
    margin-bottom: 24px;
  }

  > .error {
    display: flex;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: var(--error-red);
  }
  
  > .radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.c-channel-status-radio-button {
  all: unset;
  display: flex;
  align-items: center;
  cursor: pointer;

  > .item {
    all: unset;
    margin-right: 16px;
    border: 2px solid var(--mm-color-primary);
    width: 24px;
    height: 24px;
    border-radius: 100%;
    &:hover { background-color: var(--mm-color-bg-secondary); };

    > .indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: relative;
  
      &:after {
        content: "";
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--mm-color-primary);
      }
    }
  }

  > .label {
    cursor: pointer;

    > .status {
      &.is-live {
        color: var(--mm-color-positive);
      }

      &.is-offline {
        color: var(--error-red);
      }
    }
  }
}
`;
