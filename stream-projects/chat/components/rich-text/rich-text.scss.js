import { scss } from "../../deps.ts";

export default scss`
.rich-text {
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow: hidden;
  min-height: 24px;

  /* these emote styles are set in the parent because we're rendering the 
  emote component to a string */
  .truffle-emote {
    width: auto !important;
    height: 28px;
    // margin: -1px 2px 1px;
    vertical-align: middle;
  }
}
`