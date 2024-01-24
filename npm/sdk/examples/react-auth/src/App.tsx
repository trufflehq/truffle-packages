import './App.css';
import { getAccessToken, getMtClient } from '@trufflehq/sdk';
import { observer } from '@legendapp/state/react';
import { useEffect, useMemo, useState } from 'react';
import {
  OrgMemberPayload,
  OrgPayload,
  RolePayload,
} from '@trufflehq/mothertree-client';

function App() {
  const mtClient = useMemo(() => getMtClient(), []);

  const [org, setOrg] = useState<OrgPayload>();
  const [orgMember, setOrgMember] = useState<OrgMemberPayload>();
  const [roles, setRoles] = useState<RolePayload[]>([]);
  useEffect(() => {
    mtClient?.getOrg().then((org) => setOrg(org));
    mtClient?.getOrgMember().then((orgMember) => setOrgMember(orgMember));
    mtClient?.getRoles().then((roles) => setRoles(roles));

    getAccessToken().then((token) => {
      console.log('access token', token);
    });
  }, []);

  const iconUrl = useMemo(() => {
    const image = org?.image;
    if (!image) return;
    const src = `https://${image.cdn}/${image.variations[0]?.path}`;
    return src as string;
  }, [org]);

  return (
    <div className="App">
      <div>Org: {org?.name}</div>
      <div>Org ID: {mtClient?.orgId}</div>
      {iconUrl && <img src={iconUrl} />}
      <h2>Welcome, {orgMember?.name}</h2>
      <div>
        <h3>Roles</h3>
        <ul>
          {roles.map((role) => (
            <li key={role.id}>{role.slug}</li>
          ))}
        </ul>
      </div>
      {/* <img src={getSrcByImageObj(user.avatarImage.get(), { size: "small" })} /> */}
    </div>
  );
  return <></>;
}

// we wrap the app component so that it listens to changes on the legend observables
export default observer(App);
