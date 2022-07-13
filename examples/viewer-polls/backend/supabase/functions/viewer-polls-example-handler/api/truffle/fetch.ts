const TRUFFLE_API_URL = "https://c4b4-98-142-186-46.ngrok.io/graphql";

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
