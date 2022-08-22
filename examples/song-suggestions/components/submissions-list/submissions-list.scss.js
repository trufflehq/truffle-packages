import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-submissions-list {
  min-height: 150px;

  .c-row-control {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  
    thead {
      width: 100%;
      background:  var(--tfl-color-secondary-bg-fill);
    }

    th {
      position: sticky;
      top: 53px;
      z-index: 999999;
      background: var(--tfl-color-secondary-bg-fill);
      padding: 8px;
    }

    tr {
      box-sizing: border-box;
    }

    tr:nth-child(odd) {
      background: var(--tfl-color-tertiary-bg-fill);
    }

    td {
      text-align: center;
      padding: 8px;
    }

    > .tbody {
      // justify-content: center;
      display: table;
      width: 100%;
      min-height: 300px;
    }

    .empty {
      display: flex;
      justify-content: center;
      position: absolute;
      left: 0;
      right: 0;
    }

    .row-controls {
      display: inline-flex;
      gap: 12px;
      font-size: 20px;
    }
  }
}
`