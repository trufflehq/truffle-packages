import { React, gql, useQuery } from "../../deps.ts";

const ORG_USER_QUERY = gql`
  query {
    orgUser {
      roleConnection {
        nodes {
          id
          name
          slug
          rank
        }
      }
    }
  }
`;

// wrap any admin-only content in this component;
// only users with the admin role will be able to see it
export default function OnlyAdmin({ children }: { children?: any }) {
  const [{ data: orgUserData, fetching }] = useQuery({ query: ORG_USER_QUERY });
  const roles = orgUserData?.orgUser?.roleConnection?.nodes;
  const isAdmin = Boolean(roles?.find((role) => role.slug === "admin"));

  if (fetching) return <></>;
  if (!isAdmin) return <div>You must be an admin to view this page.</div>;
  else return <>{children}</>;
}
