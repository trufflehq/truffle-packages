import { serve } from "https://deno.land/std@0.159.0/http/server.ts";
import { alertUpsert } from "./util/alert.ts";
import { getCollectibleByPath } from "./util/collectible.ts";
import { makeResp } from "./util/make-resp.ts";
import { getUserById } from "./util/user.ts";

interface DoSomethingRedeemReqBody {
  runtimeData?: {
    event: {
      data: {
        orgId: string;
        userId: string;
        collectibleData: {
          collectiblePath: string;
        };
      };
    };
  };
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

    const userId = reqBody?.runtimeData?.event?.data?.userId;
    if (!userId) {
      return makeResp(400, {
        error: true,
        message:
          "Missing userId from request body. It should be defined at 'runtimeData.event.data.userId'.",
      });
    }

    const collectiblePath = reqBody?.runtimeData?.event?.data?.collectibleData?.collectiblePath;
    if (!collectiblePath) {
      return makeResp(400, {
        error: true,
        message:
          "Missing collectiblePath from request body. It should be defined at 'runtimeData.event.data.collectibleData.collectiblePath'.",
      });
    }

    let alert;
    try {
      const user = await getUserById(userId, accessToken, orgId);
      const collectible = await getCollectibleByPath(collectiblePath, accessToken, orgId);
      alert = await alertUpsert(
        { type: "do-something", data: { user, collectible } },
        accessToken,
        orgId,
      );
    } catch (error) {
      return makeResp(400, { error });
    }

    return makeResp(200, {
      error: false,
      message: "Successfully upserted alert",
      alert,
    });
  },
  {
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
    },
  },
);
