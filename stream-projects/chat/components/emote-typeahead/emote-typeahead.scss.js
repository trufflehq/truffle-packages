import { scss } from "../../deps.ts";

export default scss`
.c-emote-typeahead {
  position: absolute;
  top: -44px;
  left: 0;
  right: 0;
  background: inherit;
  border-top: 1px solid var(--mm-color-bg-secondary);
  z-index: 10;
  width: 100%;

  // FIXME: figure out overflow-x: auto while being able to render the emote tooltip
  overflow-x: auto;

  display: flex;
  gap: 12px;
  box-sizing: border-box;
  padding: 8px 12px;
  /* these emote styles are set in the parent because we're rendering the 
  emote component to a string */
  .truffle-emote {
    width: auto !important;
    height: 28px;
    vertical-align: middle;
  }
}
`;
