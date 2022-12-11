import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP

import {
  ActivityBannerEmbed,
  ActivityBannerProps,
  AlertBanner,
  PollBanner,
} from "../../components/activities/mod.ts";

type Foo = {
  bar: string;
};

function FooBanner(props: ActivityBannerProps<Foo>) {
  return <div>{props.activity.bar}</div>;
}

function HomePage() {
  const banners = {
    poll: PollBanner,
    alert: AlertBanner,
    foo: FooBanner,
    ["raid-stream"]: AlertBanner,
  };
  return (
    <>
      <ActivityBannerEmbed banners={banners} />
    </>
  );
}

export default toDist(HomePage, import.meta.url);
