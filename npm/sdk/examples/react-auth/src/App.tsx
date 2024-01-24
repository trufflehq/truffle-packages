import "./App.css";
import { getAccessToken, getMtClient } from "@trufflehq/sdk";
import { observer } from "@legendapp/state/react";
import { useEffect, useMemo, useState } from "react";

function App() {

  const mtClient = useMemo(() => getMtClient(), []);

  const [org, setOrg] = useState<any>();
  const [orgMember, setOrgMember] = useState<any>();
  const [roles, setRoles] = useState<any[]>([]);
  useEffect(() => {

    mtClient?.getOrg().then((org) => setOrg(org));
    mtClient?.getOrgMember().then((orgMember) => setOrgMember(orgMember));
    mtClient?.getRoles().then((roles) => setRoles(roles));

    getAccessToken().then((token) => {
      console.log("access token", token);
    });

  }, []);

  return (
    <div className="App">
      {/* when using a legend state observable, you can use the `.get()` method to get the current value */}
      {/* the cool thing is that it will automatically update on any changes */}
      <div>Org: { org?.name }</div>
      <div>Org ID: { mtClient?.orgId}</div>
      <h2>Welcome, { orgMember?.name }</h2>
      <div>
        <h3>Roles</h3>
        <ul>
          { roles.map((role) => <li key={role.id}>{role.slug}</li>) }
        </ul>
      </div>
      {/* <img src={getSrcByImageObj(user.avatarImage.get(), { size: "small" })} /> */}
    </div>
  );
  return <></>
}

// we wrap the app component so that it listens to changes on the legend observables
export default observer(App);
