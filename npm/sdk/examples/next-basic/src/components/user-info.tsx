import { fromSpecObservable } from '@/lib/from-spec-observable';
import { useMemo } from 'react';
import { observer } from '@legendapp/state/react';
import { truffle } from '@/lib/truffle';

function UserInfo() {
  // create a memoized legend observable
  const orgUser = useMemo(
    () =>
      // make sure we're not server rendering
      truffle && fromSpecObservable(truffle.orgUser.observable),
    []
  );

  return (
    <div className="c-user-info">
      <h2>Org user info</h2>
      <div>
        <div>Org user ID: {orgUser?.id.get()}</div>
        <div>Username: {orgUser?.name.get()}</div>
        <div>
          <h3>Roles</h3>
          <ul>
            {orgUser?.roleConnection.nodes.get()?.map((role) => (
              <li key={role.id}>{role.slug}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default observer(UserInfo);
