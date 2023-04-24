import './App.css';
import { getSrcByImageObj, getAccessToken } from '@trufflehq/sdk';
import { observer } from '@legendapp/state/react';
import { fromSpecObservable } from './from-spec-observable';
import { useEffect, useState } from 'react';
import { truffle } from './truffle';

// here we're creating observables using the legend state library
// https://legendapp.com/open-source/state/
const user = fromSpecObservable(truffle.user.observable);
const orgUser = fromSpecObservable(truffle.orgUser.observable);
const org = fromSpecObservable(truffle.org.observable);

function App() {
  // `.observable` is actually a spec compliant observable
  // https://github.com/tc39/proposal-observable
  // you can interact with it directly if you want, but we prefer to use legend :p
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  // this is how you use spec compliant observables without legend
  useEffect(() => {
    const subscription = truffle.org.observable.subscribe({
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
