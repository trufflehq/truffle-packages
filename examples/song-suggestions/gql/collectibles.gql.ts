import { gql } from "https://tfl.dev/@truffle/api@~0.1.0/client.ts";

export const COLLECTIBLE_BY_SLUG_QUERY = gql`
query CollectibleQuery ($input: CollectibleInput!) {
    collectible(input: $input) {
       id
       orgId
       slug
       name
       type
       targetType
       data {
           category
           redeemType
           description
           redeemData
       }
       ownedCollectible {
        count
       }
    }
}
`;

export const OWNED_COLLECTIBLE_REDEEMED_MUTATION = gql`
mutation OwnedCollectibleRedeem ($input: OwnedCollectibleRedeemInput) {
    ownedCollectibleRedeem(input: $input) {
        redeemResponse
        redeemError
    }
}
`;
