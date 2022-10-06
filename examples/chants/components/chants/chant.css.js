import css from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

// sass example (make sure file is named ___.scss.js or ___.sass.js)
export default css`
@keyframes pop {
  50%  {transform: scale(2);}
}

@keyframes rainbow { to { background-position: 0 - 200% } }
`;
