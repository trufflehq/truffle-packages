import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-poll-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--tfl-spacing-layout-lg);

  > .inner {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 80%;

    .c-poll-preview {
      display: flex;
      margin-bottom: var(--tfl-spacing-layout-md);

      > .poll {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: var(--tfl-spacing-layout-md);
        flex: 1;

        > .inner {
          display: flex;
          flex-direction: column;
          width: 80%;
          height: fit-content;
          background: var(--tfl-color-secondary-bg-fill);
          clip-path: inset(0% 0% 0% 0% round 10px);

          > .body {
            padding: 16px 16px 0 16px;
          }

          > .progress {
            margin-top: var(--tfl-spacing-layout-sm);
          }
        }
      }

      > .preview {
        flex: 1;
      }
    }

    .controls {
      margin-top: var(--tfl-spacing-md);
      display: flex;
      justify-content: center;
      gap: var(--tfl-spacing-xl);
    }
  }

  .c-submission-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
  
    > .link {
      display: flex;
      align-items: center;
  
      svg {
        margin-left: 4px;
        width: 20px;
        height: 20px;
        color: var(--tfl-color-primary-fill);
        > path {
            fill: var(--tfl-color-primary-fill);
        }
      }
    }
  
    > .embed {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 500px;
    }
  
    > .credit {
      margin-top: 12px;
      margin-bottom: var(--tfl-spacing-md);
      display: flex;
      align-items: center;
      gap: 7px;
    }
  
    a {
      font-weight: 600;
      color: var(--tfl-color-primary-fill);
      text-align: center;
    }
  }
}

`