import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.link {
  display: flex;
  justify-content: center;
  align-items: center;
  
  a {
    display: inline-block;
    color: var(--tfl-color-on-primary-fill);
    max-width: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  svg {
    margin-left: 4px;
    width: 20px;
    height: 20px;
    color: var(--tfl-color-primary-fill);
    cursor: pointer;
    > path {
        fill: var(--tfl-color-primary-fill);
    }
  }
}
`