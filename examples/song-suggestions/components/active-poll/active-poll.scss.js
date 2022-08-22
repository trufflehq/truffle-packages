import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`.c-active-poll {
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  background: var(--tfl-color-bg-fill);
  color: var(--tfl-color-on-bg-fill);
  --tfl-poll-bg: #9146FF;
  --tfl-poll-primary-fill: #FFFFFF;
  --tfl-progress-bg: #FFFFFF;
  --tfl-color-secondary-bg-border: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill: rgba(22, 31, 44, 1);
  --tfl-color-secondary-bg-fill-hovered: rgb(50, 70, 99);
  --tfl-color-tertiary-bg-fill: rgba(45, 57, 74, 1);

  .c-collapsed-poll {
    display: flex;
    flex-direction: column;

    > .inner {
      display: flex;
      align-items: center;
      padding: 14px;
    }

    .tooltips {
      display: flex;
      gap: 8px;
      position: absolute;
      right: 6px;
      top: 2px;
      z-index: 2001;
    }
  }

  .c-collapsible-toggle {
    cursor: pointer;
    width: fit-content;
    height: 100%;
  
    > svg {
      width: 24px;
      height: 24px;
    }
  }

  .c-expanded-poll {
    > .inner {
      padding: 6px 10px;

      > .count {
        background: rgba(0, 0, 0, 0.1);
        padding: 8px;
      }

      > .button {
        background: rgba(255, 0, 0, 0.2);
        border: none;
        padding: 8px;
        margin-top: 4px;
        cursor: pointer;
      }

      .primary-button {
        display: flex;
        justify-content: center;
        height: 28px;
        font-family: var(--tfl-font-family-body-mono);
        font-weight: var(--tfl-font-weight-body-semibold);
        --tfl-color-surface-fill: var(--tfl-color-primary-fill);

        &:hover {
          --tfl-color-surface-fill-hovered: var(--tfl-color-primary-fill);
        }

        &:active {
          --tfl-color-surface-fill-pressed: var(--tfl-color-primary-fill);
        }
      }

      > footer {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 12px;
        
      }
      
      .is-voting-enabled {
        margin: 16px 0 0 0;
      }
    }

    .header {
      display: flex;
      flex: 1;

      > .info {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: flex-start;


        > .link {
          font-size: 12px;
          color: var(--tfl-poll-primary-fill);

          > a {
            max-width: 270px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          svg {
            margin-left: 0px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    .c-poll-body {
      > header {
        padding: 12px;
      }
    }

    .tooltips {
      display: flex;
      gap: 8px;
      position: absolute;
      right: 8px;
      top: 4px;
      z-index: 2001;
    }
  }
}
`