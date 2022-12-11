import { scss } from "../../../deps.ts";

export default scss`
.c-prediction-list-item {
  .winner {
    color: var(--error-red);
  }

  .c-prediction-list-item__preview {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    padding: 4px 12px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    background: var(--mm-color-bg-tertiary);
    border-bottom-left-radius: 4px;
    gap: 6px;
  }
}
`