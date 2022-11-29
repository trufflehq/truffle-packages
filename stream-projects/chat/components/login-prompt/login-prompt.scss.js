import { scss } from "../../deps.ts";

export default scss`
.c-login-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* TODO put this in an overlay bg css var, w/ what rachel has */
}
`