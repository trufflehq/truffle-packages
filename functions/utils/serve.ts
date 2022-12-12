import { ConnInfo, serve } from "https://deno.land/std@0.167.0/http/server.ts";
import { GraphQLClient } from "https://deno.land/x/graphql_request@v4.1.0/mod.ts";
import { makeResp } from "./make-resp.ts";

const DEFAULT_MYCELIUM_API_URL = "https://mycelium.truffle.vip/graphql";

interface EdgeFunctionHandlerParams<RuntimeDataType = unknown> {
  myceliumClient: GraphQLClient;
  request: Request;
  connInfo: ConnInfo;
  runtimeData: RuntimeDataType;
}

interface EdgeFunctionHandlerOptions {
  apiUrl?: string;
}

export interface MyceliumGQLResponse<T = unknown> {
  data: T;
  errors: unknown[];
}

type EdgeFunctionHandler<RuntimeDataType> = (
  params: EdgeFunctionHandlerParams<RuntimeDataType>
) => Response | Promise<Response>;

export function serveTruffleEdgeFunction<RuntimeDataType = unknown>(
  handler: EdgeFunctionHandler<RuntimeDataType>,
  options?: EdgeFunctionHandlerOptions
) {
  return serve(
    async (request, connInfo) => {
      const accessToken = request.headers.get("x-access-token");
      const orgId = request.headers.get("x-org-id");

      // TODO: implement some kind of mechanism to verify that the request is coming from truffle

      // return an error if they don't provide an access token
      if (!accessToken) {
        return makeResp(400, {
          error: true,
          message:
            "Please provide a user access token via the 'x-access-token' header.",
        });
      }

      // return an error if they don't provide an access token
      if (!orgId) {
        return makeResp(400, {
          error: true,
          message: "Please provide an org id via the 'x-org-id' header.",
        });
      }

      let runtimeData: RuntimeDataType;
      try {
        runtimeData = (await request.json())?.runtimeData;
      } catch {
        return makeResp(400, {
          error: true,
          message: "Please provide a valid JSON body.",
        });
      }

      const myceliumClient = new GraphQLClient(
        options?.apiUrl ?? DEFAULT_MYCELIUM_API_URL,
        {
          headers: {
            "Content-Type": "application/json",
            "x-org-id": orgId,
            "x-access-token": accessToken,
          },
        }
      );

      return handler({
        myceliumClient,
        request,
        connInfo,
        runtimeData,
      });
    },
    {
      onListen({ hostname, port }) {
        console.log(`Listening on http://${hostname}:${port}`);
      },
    }
  );
}
