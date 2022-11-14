export function makeResp(statusCode: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
