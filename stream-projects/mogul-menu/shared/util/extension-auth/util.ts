import { ConnectionSourceType } from "../../../deps.ts";
import { OrgUserConnections } from "../../../types/mod.ts";

export function hasConnection(orgUser: OrgUserConnections, sourceType: ConnectionSourceType) {
  if (!sourceType || !orgUser?.connectionConnection?.nodes?.length) return false;
  return orgUser.connectionConnection.nodes.map((connection) => connection.sourceType).includes(
    sourceType,
  );
}
