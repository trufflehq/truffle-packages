import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { APIChatInputApplicationCommandInteraction } from "https://deno.land/x/discord_api_types@0.36.1/v10.ts";
import { verifySignature } from "./util/verifySignature.ts";
import { ack } from "./util/respond.ts";
import { userInfo } from "./interactions/user.ts";

const publicKey = Deno.env.get("DISCORD_PUBLIC_KEY")!;

async function isValidRequest(request: Request): Promise<boolean> {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  if (!signature || !timestamp || !request.body) {
    return false;
  }
  const rawBody = await request.clone().text();
  return verifySignature(publicKey, signature, timestamp, rawBody);
}

const handler = async (request: Request): Promise<Response> => {
  console.dir(request);
  try {
    if (!await isValidRequest(request)) {
      return new Response("Bad request signature", { status: 401 });
    }

    const body = await request
      .clone().json();
    const { data: { name, options } } = body;
    console.dir(body);

    if (body.type === 2) {
      const args = Object.fromEntries(
        options?.map((
          { name, value }: { name: string; value: string },
        ) => [name, value]) ?? [],
      );

      if (name === "user") {
        return userInfo(
          body as APIChatInputApplicationCommandInteraction,
          args.user,
        );
      }
    }

    return ack();
  } catch (e) {
    console.error(e);
    return ack();
  }
};

serve(handler);
