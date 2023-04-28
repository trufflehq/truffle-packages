import React from "https://npm.tfl.dev/react";
import { toDist } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;

import Home from "../components/home/home.tsx";
import {
  discordIconPath,
  instagramIconPath,
  tiktokIconPath,
  twitchIconPath,
  twitterIconPath,
  youtubeIconPath,
} from "../utils/icons.ts";

const LINKS = [
  { name: "Twitch", url: "https://twitch.tv/stanz", iconPath: twitchIconPath },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@stanz",
    iconPath: youtubeIconPath,
  },
  {
    name: "Stanz but Gaming",
    url: "https://www.youtube.com/c/stanzbutgaming",
    iconPath: youtubeIconPath,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/nathanstanz",
    iconPath: twitterIconPath,
  },
  {
    name: "Discord",
    url: "https://discord.gg/stanz",
    iconPath: discordIconPath,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/nathanstanz",
    iconPath: instagramIconPath,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@onenightstanz",
    iconPath: tiktokIconPath,
  },
];

function HomePage() {
  return (
    <Home
      avatarUrl="https://cdn.bio/ugc/file/094ee050-61d3-11eb-ae77-b305acd7f0af/6c519f40-5600-11ec-8ea8-4f3dd9048ea9.small.png"
      creatorName="Stanz"
      links={LINKS}
    />
  );
}

export default toDist(HomePage, import.meta.url);
