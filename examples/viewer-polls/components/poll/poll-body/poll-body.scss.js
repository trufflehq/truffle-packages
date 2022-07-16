import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-poll-body {
  > header {
    padding: var(--tfl-spacing-lg);
    margin-bottom: var(--tfl-spacing-layout-sm);
  }

  > header > .title {
    display: flex;
    justify-content: center;

    font-size: var(--tfl-font-size-heading-md);
    line-height: var(--tfl-line-height-heading-md);
    font-family: var(--tfl-font-family-heading-sans);
    margin-bottom: var(--tfl-spacing-xs);
  }
}`;
