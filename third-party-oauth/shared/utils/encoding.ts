import { jose } from "../../deps.ts";

import { OAuthSourceType } from "../mod.ts";
const privateKey =
  `QUFBQUMzTnphQzFsWkRJMU5URTVBQUFBSUxGenp2MFhWNWNMTzJCaUxCYlBoTCtMV0RmellvS2JXc1RzNWFpS3FNcVkK`;
// const privateKey = 'javainuse-secret-key'
export async function importKey() {
  return jose.importJWK({
    alg: "HS256",
    k: privateKey,
    kty: "oct",
  });
}

export async function verifyJWT(token: string) {
  const key = await importKey();
  const payload = (await jose.jwtVerify(token, key)).payload;

  return payload;
}

export function encodeJwtPart(str: string) {
  return encodeURIComponent(str || "").replace(/%20/g, " ");
}

export function decodeJwtPart(str: string) {
  return decodeURIComponent(str);
}

// TODO: let sever generate oauth url
export async function signJwt(
  sourceType: OAuthSourceType,
  accessToken: string,
  orgId: string,
) {
  const payload = {
    sourceType,
    accessToken,
    orgId,
  };

  const key = await importKey();
  return new jose.SignJWT(payload)
    .setIssuedAt()
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(key);
}
