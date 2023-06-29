import { org$ } from "./truffle-app.ts";

export function getOrgId() {
  // NOTE: this isn't perfect sync it's async after page load, but i think good enough for
  // all we use getOrgId for
  return org$.get()?.id;
}
