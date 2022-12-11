import {
  React,
  getSrcByImageObj,
  useQuery,
  useStyleSheet,
  abbreviateNumber,
  classKebab,
  formatNumber,
  ImageByAspectRatio,
  Spinner,
  useRef,
  _,
} from "../../deps.ts";
import { Product, OrgUserCounter, File } from "../../types/mod.ts";
import {
  CHANNEL_POINTS_QUERY,
  CHANNEL_POINTS_SHOP_QUERY,
} from "./gql.ts";
import { useDialog } from "../base/dialog-container/dialog-service.ts";
import ChannelPointsActionsDialog from "../dialogs/channel-points-actions-dialog/channel-points-actions-dialog.tsx";
import LinkButton from "../base/link-button/link-button.tsx";
import ConfirmPurchaseDialog from "../dialogs/confirm-cp-purchase-dialog/confirm-cp-purchase-dialog.tsx";
import styleSheet from "./channel-points-shop.scss.js";

// TODO pull from EconomyTrigger model once we set that up
const CP_PURCHASE_ECONOMY_TRIGGER_ID = "4246f070-6f68-11ec-b706-956d4fcf75c0";

export default function ChannelPointsShop() {
  useStyleSheet(styleSheet);
  const { pushDialog } = useDialog();
  const channelPointsImageObj = undefined;

  // const {
  //   channelPointsOrgUserCounterObs,
  //   channelPointsImageObj,
  //   onViewCollection,
  //   buttonBg,
  //   onHowToEarnClick,
  //   enqueueSnackBar,
  // } = props;
  // const { model } = useContext(context);

  // shop items
  const [{ data: storeItemsData }] = useQuery({
    query: CHANNEL_POINTS_SHOP_QUERY,
  });

  const storeCollectibleItems: Product[] = _.sortBy(
    storeItemsData?.productConnection?.nodes ?? [],
    (node: Product) => {
      return node?.productVariants?.nodes?.[0]?.amountValue;
    }
  );

  // channel points
  const [{ data: channelPointsData }] = useQuery({
    query: CHANNEL_POINTS_QUERY,
  });
  const channelPoints: OrgUserCounter =
    channelPointsData?.channelPoints?.orgUserCounter;

  const onHowToEarnClick = () => {
    pushDialog(<ChannelPointsActionsDialog />);
  };

  // const channelPointsSrc =
  //   model.image.getSrcByImageObj(channelPointsImageObj) ??
  //   "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";
  const channelPointsSrc =
    "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";
  const isLoading = !storeCollectibleItems;

  return (
    <div className="c-channel-points-shop">
      <div className="header">
        <div className="title">Shop Items</div>
        <div className="channel-points">
          <div className="icon">
            <ImageByAspectRatio
              imageUrl={channelPointsSrc}
              aspectRatio={1}
              widthPx={16}
              height={16}
            />
          </div>
          <div className="amount">
            {abbreviateNumber(channelPoints?.count || 0, 1)}
          </div>
        </div>
      </div>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          {!_.isEmpty(storeCollectibleItems) && (
            <div className="items">
              {storeCollectibleItems?.map((storeCollectibleItem) => {
                return (
                  <CollectibleItem
                    channelPointsImageObj={channelPointsImageObj}
                    channelPoints={channelPoints}
                    collectibleItem={storeCollectibleItem}
                  />
                );
              })}
            </div>
          )}
          <div className="how-to-earn">
            <div className="mm-text-header-caps title">Earn Channel points</div>
            <div className="mm-text-body-1 description">
              Start earning channel points to spend in the shop
            </div>
            <div className="link">
              <LinkButton onClick={onHowToEarnClick}>
                How do I earn channel points?
              </LinkButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CollectibleItemProps {
  collectibleItem: Product;
  channelPoints: OrgUserCounter;
  channelPointsImageObj?: File;
  buttonBg?: string;
}

function CollectibleItem(props: CollectibleItemProps) {
  const { channelPoints, collectibleItem, channelPointsImageObj, buttonBg } =
    props;

  const { pushDialog } = useDialog();

  const $$itemRef = useRef(null);

  const file = collectibleItem?.source?.fileRel;

  const amount = collectibleItem.productVariants.nodes[0].amountValue;

  const hasSufficientFunds = channelPoints?.count >= amount;
  // const channelPointsSrc =
  //   model.image.getSrcByImageObj(channelPointsImageObj) ??
  //   "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";

  const channelPointsSrc =
    "https://cdn.bio/assets/images/features/browser_extension/channel-points-default.svg";

  const onPurchaseRequestHandler = () => {
    pushDialog(
      <ConfirmPurchaseDialog
        collectibleItem={collectibleItem}
        channelPointsImageObj={channelPointsImageObj}
        buttonBg="var(--mm-gradient)"
      />
    );
  };

  return (
    <div
      className={`item ${classKebab({
        isDisabled: !hasSufficientFunds,
      })}`}
      ref={$$itemRef}
    >
      <div className="overlay" />
      <div className="card">
        <div className="image">
          <ImageByAspectRatio
            imageUrl={getSrcByImageObj(file?.fileObj)}
            aspectRatio={file?.fileObj?.data?.aspectRatio}
            height={64}
            width={64}
          />
        </div>
        <div className="title">{collectibleItem?.source?.name ?? ""}</div>
        <div className="bottom" onClick={onPurchaseRequestHandler}>
          <div className="amount">{formatNumber(amount)}</div>
          <div className="icon">
            <ImageByAspectRatio
              imageUrl={channelPointsSrc}
              aspectRatio={1}
              width={18}
              height={18}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
