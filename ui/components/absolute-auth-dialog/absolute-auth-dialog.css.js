import css from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default css`
.header>.title {
  font-family: var(--truffle-font-family);
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  margin-bottom: 8px;
}

.header>.description {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}

.header>.description>.login-toggle {
  color: var(--tfl-color-primary-text);
  margin-left: 8px;
  cursor: pointer;
}

.footer {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.input-wrapper {
  margin: 16px 0;
  position: relative;
}

.input-wrapper.has-error > .error {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--tfl-color-critical-text);
}`;
