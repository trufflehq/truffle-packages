import HomeTab from "../../components/home-tab/home-tab.tsx";
import ActivitiesTab from "../../components/activities/activities-tab/activities-tab.tsx";
import TestTab from "../../components/test-tab/test-tab.tsx";
import CollectionTab from "../../components/collection-tab/collection-tab.tsx";
import SeasonPassTab from "../../components/season-pass-tab/season-pass-tab.tsx";
import ChannelPointsShopTab from "../../components/channel-points-shop-tab/channel-points-shop-tab.tsx";
import ChatTab from "../../components/chat-tab/chat-tab.tsx";

export const DEFAULT_TABS = [
  // {
  //   text: "Test",
  //   slug: "test",
  //   imgUrl: "",
  //   $el: TestTab,
  // },
  {
    text: "Home",
    slug: "home",
    imgUrl: "https://cdn.bio/assets/images/features/browser_extension/home.svg",
    $el: HomeTab,
  },
  {
    text: "Activities",
    slug: "activities",
    imgUrl: "https://cdn.bio/assets/images/features/browser_extension/activities.svg",
    $el: ActivitiesTab,
  },
  {
    text: "Collection",
    slug: "collection",
    imgUrl: "https://cdn.bio/assets/images/features/browser_extension/collection.svg",
    $el: CollectionTab,
  },
  {
    text: "Shop",
    slug: "shop",
    imgUrl: "https://cdn.bio/assets/images/features/browser_extension/store.svg",
    $el: ChannelPointsShopTab,
  },
];

export const SEASON_PASS_TAB = {
  text: "Battle Pass",
  slug: "battle-pass",
  imgUrl: "https://cdn.bio/assets/images/features/browser_extension/gamepad.svg",
  $el: SeasonPassTab,
};

export const CHAT_TAB = {
  text: "Chat",
  slug: "chat",
  imgUrl: "https://cdn.bio/assets/images/features/browser_extension/support-chat-light.svg",
  $el: ChatTab,
};
