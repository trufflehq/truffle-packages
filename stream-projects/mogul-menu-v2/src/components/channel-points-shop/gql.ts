import { gql } from "../../deps.ts";
export const CHANNEL_POINTS_SHOP_QUERY = gql`
  query ChannelPointsShopQuery {
    productConnection(first: 50, input: { sourceType: "collectible" }) {
      nodes {
        id
        source
        productVariants {
          nodes {
            amountType
            amountId
            amountValue
          }
        }
      }
    }
  }
`;

export const CHANNEL_POINTS_QUERY = gql`
  query ChannelPointsQuery {
    channelPoints: orgUserCounterType(input: { slug: "channel-points" }) {
      orgUserCounter {
        count
      }
    }
  }
`;
