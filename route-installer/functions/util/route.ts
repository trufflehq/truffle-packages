import { MyceliumClient } from "../../deps.ts";
import { Module } from "./modules.ts";

export interface RouteUpsertInput {
  packageVersionId?: string;
  pathWithVariables?: string;
  parentId?: string;
  componentId?: string;
  type?: "layout" | "page" | "empty";
  data?: Record<string, unknown>;
  myceliumClient: MyceliumClient;
}

interface RouteUpsertResponse {
  routeUpsert: {
    route: {
      id: string;
    };
  };
}

let id = 0;
export async function routeUpsert({
  packageVersionId,
  pathWithVariables,
  parentId,
  componentId,
  type,
  data,
  myceliumClient,
}: RouteUpsertInput) {
  const query = `
    mutation RouteUpsert($input: RouteUpsertInput!) {
      routeUpsert(input: $input) {
        route { id }
      }
    }  
  `;
  const variables = {
    input: {
      pathWithVariables,
      packageVersionId,
      parentId,
      componentId,
      data,
      type,
    },
  };

  console.log("upserting", { pathWithVariables, parentId, componentId, type });
  return { id: String(id++) };

  const response = await myceliumClient.query<RouteUpsertResponse>(
    query,
    variables
  );
  return response?.routeUpsert?.route;
}

export async function saveRoute({
  filenameParts,
  module,
  otherModules,
  packageVersionId,
  myceliumClient,
}: {
  filenameParts: string[];
  module: Module;
  otherModules: Module[];
  packageVersionId: string;
  myceliumClient: MyceliumClient;
}) {
  const defaultExportComponentId = module.exports.find(
    ({ type }) => type === "default"
  )?.componentRel?.id;

  const filenamePath = `/${filenameParts
    .slice(1, filenameParts.length - 1)
    .join("/")}`;
  const dbPath = filenamePath
    // nextjs style catch alls `[...slug]`. dir names can't be * on windows
    // TODO: support the difference between [[...slug]] and [...slug]
    // https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes)
    .replace(/\[?\[\.\.\.(.*?)\]\]?/g, "*")
    // /abc/[param] -> /abc/:param
    .replace(/\[(.*?)\]/g, ":$1");
  const pathParts = dbPath.split("/");
  const fileParts = filenamePath.split("/");
  const paths = pathParts.map(
    (_, i) => `${pathParts.slice(0, i + 1).join("/")}`
  );
  const filenames = fileParts.map(
    (_, i) => `${fileParts.slice(0, i + 1).join("/")}`
  );
  // make sure there's a top level route
  let prevRoute = await routeUpsert({
    packageVersionId,
    pathWithVariables: "",
    type: "empty",
    myceliumClient,
  });
  // create a top level router and another router for any folders w/ layout.tsx
  for await (const [i, path] of paths.entries()) {
    if (path === "/") {
      break;
    } // we already upsert one for path = ''

    // FIXME: support .ts|.jsx|.js too
    const layoutFilename = `/routes${filenames[i]}/layout.tsx`;
    const layoutModule = otherModules.find(
      ({ filename }) => filename === layoutFilename
    );

    let layoutDefaultExportComponentId = "";
    if (layoutModule) {
      layoutDefaultExportComponentId =
        layoutModule.exports.find(({ type }) => type === "default")
          ?.componentRel?.id ?? "";
    }

    prevRoute = await routeUpsert({
      packageVersionId,
      parentId: prevRoute?.id,
      pathWithVariables: path,
      componentId: layoutDefaultExportComponentId,
      type: layoutModule ? "layout" : "empty",
      myceliumClient,
    });
  }

  await routeUpsert({
    packageVersionId,
    parentId: prevRoute?.id,
    pathWithVariables: pathParts.join("/"),
    componentId: defaultExportComponentId,
    type: "page",
    myceliumClient,
  });
}
