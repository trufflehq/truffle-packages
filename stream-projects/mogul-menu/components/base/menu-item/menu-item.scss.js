import { scss } from "../../../deps.ts";

export default scss`
.c-menu-item {
  display: flex;
  justify-content: space-between;
  padding: 20px 26px;
  cursor: pointer;
  transition: all linear 50ms;
  box-sizing: border-box;
  border: 2px solid transparent;  
  outline: none; 

  &:focus, 
  &:active {
    border: 2px solid var(--mm-color-primary);
  }

  >.left {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  >.right {
    display: flex;
    align-items: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
`;
