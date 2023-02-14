import { gql } from '@urql/core';

export const ORG_QUERY = gql`
  query SDKOrgQuery($id: ID, $slug: String) {
    org(input: { id: $id, slug: $slug }) {
      id
      slug
      name
    }
  }
`;
