import { MyceliumClient, gql } from "../../deps.ts";

export interface Module {
  id: string;
  filename: string;
  exports: {
    name: string;
    type: string;
    componentRel: {
      id: string;
    };
  }[];
}

interface ModuleConnection {
  nodes: Module[];
}

const MODULE_CONNECTION_QUERY = gql`
  query ($packageVersionId: ID!) {
    moduleConnection(input: { packageVersionId: $packageVersionId }) {
      nodes {
        id
        filename
        exports {
          name
          type
          componentRel {
            id
          }
        }
      }
    }
  }
`;

export async function getModulesByPackageVersionId(
  packageVersionId: string,
  myceliumClient: MyceliumClient
) {
  return (
    await myceliumClient.query<{ moduleConnection: ModuleConnection }>(
      MODULE_CONNECTION_QUERY,
      {
        packageVersionId,
      }
    )
  )?.moduleConnection?.nodes;
}
