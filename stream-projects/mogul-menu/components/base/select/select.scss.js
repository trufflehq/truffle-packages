import { scss } from "../../../deps.ts";

export default scss`
.c-select {
  background: var(--mm-color-bg-secondary);
  color: var(--mm-color-text-bg-secondary);
  position: relative;
  
  >.selected-option {
    padding: 14px 12px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  >.dropdown {
    position: fixed;
    /* TODO: figure out some way to get this to be 100% width of parent; */
    /* "position: absoulte" doesn't work because any parent that has overflow:hidden will hide it */
    // width: 100%;
    background: var(--mm-color-bg-tertiary);
    color: var(--mm-color-text-bg-tertiary);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    max-height: 170px;
    overflow-y: auto;
    z-index: 5;
    
    >.option {
      padding: 14px 12px;
      
      &:hover:not(.disabled) {
        background: var(--mm-color-bg-secondary);
        cursor: pointer;
      }

      &.disabled {
        cursor: not-allowed;
        color: rgb(255, 255, 255, 0.6);
      }
    }
  }
}
`;
