const isSsr = Boolean(globalThis?.Deno);

console.log("index...");

if (isSsr) {
  Deno.env.set("ULTRA_MODE", "development");
  await import("./server.tsx");
} else {
  await import("./client.tsx");
}
