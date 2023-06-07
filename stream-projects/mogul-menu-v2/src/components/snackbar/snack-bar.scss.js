import { scss } from "../../deps.ts";

export default scss`
.c-snack-bar-el {
  display: flex;
  justify-content: space-between;
  border-radius: 2px;
  overflow: hidden;
  visibility: hidden;

  >div {
    padding: 9px 12px;
    font-size: 12px;
    font-weight: 500;
  }

  >.message {
    display: flex;
    align-items: center;
    flex-grow: 1;
    background: var(--mm-color-bg-secondary);
    color: var(--mm-color-text-bg-secondary);
    line-height: 24px;
  }

  >.value {
    flex-grow: 0;
    background: var(--mm-color-bg-tertiary);
    color: var(--mm-color-text-bg-tertiary);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
  }

  &.flat {
    >.value {
      background: var(--tertiary-base);
      color: var(--tertiary-base-text);
    }
  }
}

@keyframes slideIn {
  0% {
    visibility: visible;
    opacity: 0;
    transform: translate(0, 20%);
  }

  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
}

@keyframes stayVisible {
  from {
    visibility: visible;
  }
}

@keyframes slideOut {

  0% {
    visibility: visible;
    opacity: 1;
    transform: translate(0, 0);
  }

  100% {
    opacity: 0;
    transform: translate(0, 20%);
  }
}
`;
