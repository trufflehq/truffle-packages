const TRUFFLE_API_URL = "https://mycelium.staging.bio/graphql";

export function truffleFetch(
  query: string,
  variables: Record<string, unknown>,
) {
  return fetch(TRUFFLE_API_URL, {
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: new Headers({
      "Authorization": `Bearer ${Deno.env.get("TRUFFLE_API_KEY")}`,
    }),
  });
}
