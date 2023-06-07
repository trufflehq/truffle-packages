import { Avatar, React, useQuery } from "../../deps.ts";
import { ME_QUERY } from "../../shared/mod.ts";

export default function AccountAvatar({ size = "24px" }: { size?: string }) {
  const [{ data: meData, fetching }] = useQuery({
    query: ME_QUERY,
  });

  if (fetching) return <></>;

  const me = meData?.me;

  return (
    <div className="c-account-avatar">
      <a href="/edit-profile" target="_blank" rel="noreferrer">
        <Avatar user={me} size={size} />
      </a>
    </div>
  );
}
