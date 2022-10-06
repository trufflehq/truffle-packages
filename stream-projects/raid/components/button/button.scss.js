import { scss } from "../../deps.ts";

export default scss`
.c-button {
  background: var(--background);
  box-sizing: border-box;
  color: var(--text-color);
  outline: 1px solid var(--border-color);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  transition: all linear 50ms;
  font-family: var(--mm-font-family);
  font-weight: var(--font-weight);
  font-size: var(--font-size);
  outline: 2px solid transparent;
  min-width: 190px;
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;

  &:hover {
    filter: brightness(80%);
  }

  &:focus {
    outline: 3px solid var(--border-color);
  }
  &:active {
    outline: 3px solid var(--border-color);
  }

  &:disabled {
    filter: brightness(80%);
    cursor: not-allowed;
  }
}
`;
