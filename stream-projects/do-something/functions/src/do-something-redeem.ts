import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { makeResp } from "./util/make-resp.ts";

interface DoSomethingRedeemReqBody {
  runtimeData?: {};
}

serve(
  async (req) => {
    const accessToken = req.headers.get("x-access-token");
    const orgId = req.headers.get("x-org-id");
    let reqBody: DoSomethingRedeemReqBody;

    try {
      reqBody = await req.json();
    } catch {
      return makeResp(400, {
        error: true,
        message: "Please provide a valid JSON body.",
      });
    }

    // return an error if they don't provide an access token
    if (!accessToken) {
      return makeResp(400, {
        error: true,
        message: "Please provide a user access token via the 'x-access-token' header.",
      });
    }

    // return an error if they don't provide an access token
    if (!orgId) {
      return makeResp(400, {
        error: true,
        message: "Please provide an org id via the 'x-org-id' header.",
      });
    }

    console.log({ orgId, reqBody });

    return makeResp(200, {});
  },
  {
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
    },
  },
);
