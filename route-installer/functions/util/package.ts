import { MyceliumClient, gql } from "../../deps.ts";

interface Package {
  id: string;
  latestPackageVersionId: string;
}

const PACKAGE_QUERY = gql`
  query ($path: String!) {
    package(input: { path: $path }) {
      id
      latestPackageVersionId
    }
  }
`;

export async function getPackageByPath(
  path: string,
  myceliumClient: MyceliumClient
) {
  return (
    await myceliumClient.query<{ package: Package }>(PACKAGE_QUERY, { path })
  )?.package;
}
