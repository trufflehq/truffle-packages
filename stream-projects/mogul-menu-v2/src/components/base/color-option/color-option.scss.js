import { scss } from "../../../deps.ts";

export default scss`
.c-color-option {
  display: flex;
  align-items: center;
  gap: 10px;

  >.preview {
    width: 24px;
    height: 24px;
    outline: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 100%;
    background: var(--background);
    overflow: hidden;

    >.fill {
      background: var(--color);
      height: 100%;
    }
  }
}
`;
