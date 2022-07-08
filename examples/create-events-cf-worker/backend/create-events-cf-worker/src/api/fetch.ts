const TRUFFLE_API_URL = "https://mycelium.staging.bio/graphql";

export function truffleFetch(
  query: string,
  variables: Record<string, unknown>,
  orgId?: string,
) {
  console.log(Boolean(TRUFFLE_API_KEY))
  const headers = new Headers({
    "Authorization": `Bearer ${TRUFFLE_API_KEY}`,
  });

  if (orgId) {
    headers.append("x-org-id", orgId);
  }
  return fetch(TRUFFLE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
    headers,
  });
}
