const TRUFFLE_API_URL = "https://c0e4-2601-285-680-370-bc14-1217-8d64-9c71.ngrok.io/graphql";

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
