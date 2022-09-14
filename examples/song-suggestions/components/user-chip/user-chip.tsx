import { React, useQuery, Avatar, useStyleSheet } from "../../deps.ts";
import Flair from "../flair/flair.tsx";
import { ORG_USER_QUERY } from "../../gql/mod.ts";
import { OrgUser } from "../../types/mod.ts"

import styleSheet from "./user-chip.scss.js";

export default function UserChip({ userId, fallbackUsername }: { userId: string, fallbackUsername?: string }) {
  useStyleSheet(styleSheet);
  const [{ data: orgUserData, fetching }] = useQuery({
    query: ORG_USER_QUERY,
    variables: { userId },
  });

  const orgUser: OrgUser = orgUserData?.orgUser;
  const userName = fetching ? "..." : orgUser?.name ?? orgUser?.user?.name;
  const activePowerups = orgUser?.activePowerupConnection?.nodes?.map((activePowerup) => activePowerup.powerup)

  return (
    <div className="c-user-chip">
      <div className="avatar">
        <Avatar user={orgUser?.user} />
      </div>
      <div className="username">{userName ?? fallbackUsername}</div>
      {activePowerups?.length ? <Flair powerups={activePowerups} /> : null}
    </div>
  );
}

