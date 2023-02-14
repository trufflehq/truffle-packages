import './App.css';
import {
  user as userClient,
  getSrcByImageObj,
  org as orgClient,
} from '@trufflehq/sdk';
import { observer } from '@legendapp/state/react';
import { fromSpecObservable } from './from-spec-observable';
import { useEffect, useState } from 'react';

// here we're creating observables using the legend state library
// https://legendapp.com/open-source/state/
const user = fromSpecObservable(userClient.observable);
const orgUser = fromSpecObservable(userClient.orgUser.observable);
const org = fromSpecObservable(orgClient.observable);

function App() {
  // `.observable` is actually a spec compliant observable
  // https://github.com/tc39/proposal-observable
  // you can interact with it directly if you want, but we prefer to use legend :p
  const [orgId, setOrgId] = useState<string | undefined>(undefined);
  // this is how you use spec compliant observables without legend
  useEffect(() => {
    const subscription = orgClient.observable.subscribe({
      next: (org) => {
        setOrgId(org.id);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => void null,
    });

    return () => subscription.unsubscribe();
  });

  return (
    <div className="App">
      {/* when using a legend state observable, you can use the `.get()` method to get the current value */}
      {/* the cool thing is that it will automatically update on any changes */}
      <div>Org: {org.name.get()}</div>
      <div>Org ID: {orgId}</div>
      <h2>Welcome, {orgUser.name.get()}</h2>
      <img src={getSrcByImageObj(user.avatarImage.get(), { size: 'small' })} />
    </div>
  );
}

// we wrap the app component so that it listens to changes on the legend observables
export default observer(App);
