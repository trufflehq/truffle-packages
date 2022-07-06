const isSsr = Boolean(globalThis?.Deno);

if (isSsr) {
  await import("./server.tsx");
} else {
  await import("./client.tsx");
}
