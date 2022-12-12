import { makeResp, serveTruffleEdgeFunction } from "../deps.ts";
import { getModulesByPackageVersionId } from "./util/modules.ts";
import { getPackageByPath } from "./util/package.ts";
import { saveRoute } from "./util/route.ts";

interface InstallRouteRuntimeData {
  packagePath: string;
}

serveTruffleEdgeFunction<InstallRouteRuntimeData>(
  async ({ myceliumClient, runtimeData }) => {
    // get the package version id
    const packagePath = runtimeData?.packagePath;
    if (!packagePath) {
      return makeResp(400, {
        error: true,
        message: "Please specify packagePath in the runtimeData.",
      });
    }
    const pkg = await getPackageByPath(packagePath, myceliumClient);
    if (!pkg) {
      return makeResp(404, {
        error: true,
        message: "Could not find package with specified slug.",
      });
    }

    const packageVersionId = pkg.latestPackageVersionId;

    // query for the modules
    const modules = await getModulesByPackageVersionId(
      packageVersionId,
      myceliumClient
    );

    // console.log({ modules });

    // for each module, check if it has a ROUTE_INSTALL_PATH export;
    // if it does, upsert a route
    for (const module of modules) {
      const filename = module.filename;
      const filenameParts = filename.split("/");
      const isLayoutFile = filename.indexOf("layout.tsx") !== -1;
      if (filenameParts[1] === "routes" && !isLayoutFile) {
        console.log("saving route", module);
        await saveRoute({
          filenameParts: filenameParts.slice(1),
          module,
          otherModules: modules,
          // FIXME this is the wrong packageVersionId... it needs to be the packageVersionId of the package that we're installing into
          packageVersionId,
          myceliumClient,
        });
      }
    }

    return makeResp(200, { message: "success" });
  }
);
