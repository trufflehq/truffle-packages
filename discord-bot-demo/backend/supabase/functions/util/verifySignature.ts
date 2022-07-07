import { sign_detached_verify } from "https://deno.land/x/tweetnacl_deno_fix@1.1.2/src/sign.ts";
import Buffer from "https://deno.land/std@0.76.0/node/buffer.ts";

export const verifySignature = (
  publicKey: string,
  signature: string,
  timestamp: string,
  rawBody: string,
): boolean => {
  return sign_detached_verify(
    Buffer.from(timestamp + rawBody),
    Buffer.from(signature, "hex"),
    Buffer.from(publicKey, "hex"),
  );
};
