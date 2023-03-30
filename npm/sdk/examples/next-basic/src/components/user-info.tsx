import { fromSpecObservable } from '@/lib/from-spec-observable';
import { isSsr } from '@/lib/util';
import { getOrgUserClient } from '@trufflehq/sdk';
import { useMemo } from 'react';
import { observer } from '@legendapp/state/react';

function UserInfo() {
  // create a memoized legend observable
  const orgUser = useMemo(
    () =>
      // make sure we're not server rendering
      (!isSsr && fromSpecObservable(getOrgUserClient().observable)) ||
      undefined,
    []
  );

  return (
    <div className="c-user-info">
      <h2>Org user info</h2>
      <div>
        <div>Org user ID: {orgUser?.get()?.id}</div>
        <div>Username: {orgUser?.get()?.name}</div>
        <div>
          <h3>Roles</h3>
          <ul>
            {orgUser?.get()?.roleConnection.nodes.map((role) => (
              <li key={role.id}>{role.slug}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default observer(UserInfo);
