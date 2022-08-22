import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";
export default scss`.c-tooltip {
  font-size: 12px;
  z-index: 9999;
  cursor: pointer;
  --background-tooltip: var(--tfl-color-secondary-bg-fill);
}
.c-tooltip:after {
  content: "";
  transition: transform 0.25s, filter 0.25s;
  transform: translateY(-67px) translateX(-86.6%);
  filter: opacity(0);
}
@-moz-document url-prefix() {
  .c-tooltip:after {
    transform: translateY(-65px) translateX(-86.6%);
  }
}
.c-tooltip:hover:after {
  font-size: 14px;
  font-family: var(--tfl-font-family-body-mono);
  margin: none;
  display: block;
  content: attr(data-hover-text);
  filter: opacity(1);
  background: var(--background-tooltip);
  position: absolute;
  padding: 4px;
  border-radius: 4px;
  padding: 9.5px 10px 9.5px 10px;
}`;