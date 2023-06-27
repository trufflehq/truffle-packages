import {
  GLOBAL_JUMPER_MESSAGES,
  globalContext,
  jumper,
} from "../../../deps.ts";
import { getOrgId } from "../truffle/org-id.ts";

export function invalidateExtensionUser() {
  jumper.call("user.invalidateSporeUser", { orgId: getOrgId() });
  jumper.call("comms.postMessage", GLOBAL_JUMPER_MESSAGES.INVALIDATE_USER);
}
