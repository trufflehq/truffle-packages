import { scss } from "../../deps.ts";

export default scss`
.c-list-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--mm-color-bg-secondary);
  border-radius: 4px;

  &.is-clickable { 
    cursor: pointer;
  }

  > .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding: 8px;
    box-sizing: border-box;
  }

  > .body {
    flex: 1;
  }
}
`