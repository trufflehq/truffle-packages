import React from "https://npm.tfl.dev/react";
import _ from "https://npm.tfl.dev/lodash?no-check";

import {
  getSrcByImageObj,
  gql,
  useQuery,
  useStyleSheet,
} from "../../../deps.ts";
import ImageByAspectRatio from "https://tfl.dev/@truffle/ui@~0.1.0/components/legacy/image-by-aspect-ratio/image-by-aspect-ratio.tsx";
import Dialog from "../../base/dialog/dialog.tsx";
import { useDialog } from "../../base/dialog-container/dialog-service.ts";
import { fromNow } from "../../../shared/mod.ts";
import styleSheet from "./notification-dialog.scss.js";

const TRANSACTIONS_QUERY = gql`
  query EconomyTransactionsQuery {
    economyTransactionConnection(first: 50) {
      nodes {
        amountValue
        date
        amount
        economyAction {
          name
        }
      }
    }
  }
`;

export default function NotificationDialog({
  channelPointsImageObj,
  xpImageObj,
}: {
  channelPointsImageObj?: any;
  xpImageObj?: any;
}) {
  useStyleSheet(styleSheet);
  const [{ data: transactionsData }] = useQuery({ query: TRANSACTIONS_QUERY });
  const transactions =
    transactionsData?.economyTransactionConnection?.nodes ?? [];

  const channelPointsSrc = channelPointsImageObj
    ? getSrcByImageObj(channelPointsImageObj)
    : "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";
  const xpSrc = xpImageObj
    ? getSrcByImageObj(xpImageObj)
    : "https://cdn.bio/assets/images/features/browser_extension/xp.svg";

  // todo make xp the seasonPass ouc
  const ORG_USER_COUNTER_TYPE_IMG_MAP: Record<string, any> = {
    "channel-points": channelPointsSrc,
    xp: xpSrc,
  };

  return (
    <div className="c-browser-extension-notification-dialog">
      <Dialog headerStyle="primary" headerText="Notifications">
        <div className="body">
          {_.map(transactions, (transaction) => {
            return (
              <div className="transaction">
                <div className="info">
                  <div className="name">{transaction?.economyAction?.name}</div>
                  <div className="date">
                    {fromNow(transaction?.date, " ago")}
                  </div>
                </div>
                <div className="score">
                  <div className="amount">
                    {BigInt(transaction?.amountValue) > 0
                      ? `+${transaction?.amountValue}`
                      : transaction?.amountValue}
                  </div>
                  <div className="icon">
                    {transaction?.amount?.slug && (
                      <ImageByAspectRatio
                        // FIXME, this is a hack since we need to pull the active season pass slug
                        imageUrl={
                          ORG_USER_COUNTER_TYPE_IMG_MAP[
                            transaction?.amount?.slug
                          ] ?? xpSrc
                        }
                        aspectRatio={1}
                        widthPx={
                          transaction?.amount?.slug === "channel-points"
                            ? 20
                            : 24
                        }
                        height={
                          transaction?.amount?.slug === "channel-points"
                            ? 20
                            : 24
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Dialog>
    </div>
  );
}
