import './App.css';
import {
  getUserClient,
  getSrcByImageObj,
  getOrgClient,
  getOrgUserClient,
  getAccessToken,
  TruffleOrg,
  TruffleOrgUser,
  TruffleUser,
} from '@trufflehq/sdk';
import { observer } from '@legendapp/state/react';
import { fromSpecObservable } from './from-spec-observable';
import { useEffect, useMemo, useState } from 'react';

// here we're creating observables using the legend state library
// https://legendapp.com/open-source/state/

function App() {
  const user = useMemo(
    () => fromSpecObservable<TruffleUser>(getUserClient().observable),
    []
  );
  const orgUser = useMemo(
    () => fromSpecObservable<TruffleOrgUser>(getOrgUserClient().observable),
    []
  );
  const org = useMemo(
    () => fromSpecObservable<TruffleOrg>(getOrgClient().observable),
    []
  );

  // `.observable` is actually a spec compliant observable
  // https://github.com/tc39/proposal-observable
  // you can interact with it directly if you want, but we prefer to use legend :p
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  // this is how you use spec compliant observables without legend
  useEffect(() => {
    const subscription = getOrgClient().observable.subscribe({
      next: (org) => {
        setOrgId(org?.id);
      },
    });

    getAccessToken().then((token) => {
      console.log('access token', token);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="App">
      {/* when using a legend state observable, you can use the `.get()` method to get the current value */}
      {/* the cool thing is that it will automatically update on any changes */}
      <div>Org: {org.name.get()}</div>
      <div>Org ID: {orgId}</div>
      <h2>Welcome, user {orgUser.id.get()}</h2>
      <div>
        <h3>Roles</h3>
        <ul>
          {orgUser.roleConnection.nodes.get()?.map((role) => (
            <li key={role.id}>{role.slug}</li>
          ))}
        </ul>
      </div>
      <img src={getSrcByImageObj(user.avatarImage.get(), { size: 'small' })} />
    </div>
  );
}

// we wrap the app component so that it listens to changes on the legend observables
export default observer(App);
