import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss `
.c-mashing-leaderboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: var(--tfl-spacing-layout-sm);

  > .title {
    height: 100px;
    width: 300px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("https://cdn.bio/assets/images/dev_plat_examples/mash/leaderboard.svg");
    font-size: var(--tfl-font-size-heading-lg);
    padding: var(--tfl-spacing-xl);
  }

  > table {
    display: flex;
    flex-direction: column;
    width: 100%;

    > .empty {
      display: flex;
      justify-content: center;
      font-family: var(--tfl-font-family-body-mono);
      font-weight: var(--tfl-font-weight-heading-semibold);
      color: var(--tfl-color-on-bg-fill);
      font-size: var(--tfl-font-size-heading-lg);
    }

    thead {
      border-bottom: 3px solid var(--retro-green);
    }

    .row {
      display: flex;
      justify-content: center;
      flex: 1;
      align-items: center;

      tr {
        display: flex;
        flex: 1;
      }

      td, th {
        padding: var(--tfl-spacing-md);
        font-family: var(--tfl-font-family-body-mono);
        color: var(--tfl-color-on-bg-fill);
        font-size: var(--tfl-font-size-heading-md);
      }

      td {
        font-weight: var(--tfl-font-weight-heading-semibold);
      }

      th {
        font-weight: var(--tfl-font-weight-heading-bold);
      }

      th {
        display: flex;
        
      }
      
      .rank {
        min-width: 80px;
      }

      .user {
        flex: 1;
      }
    }
  }
}
`