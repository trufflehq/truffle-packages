import React from "https://npm.tfl.dev/react";
import { useStyleSheet } from "https://tfl.dev/@truffle/distribute@^2.0.0/format/wc/react/index.ts"; // DO NOT BUMP;
import { useGoogleFontLoader } from "https://tfl.dev/@truffle/utils@~0.0.3/google-font-loader/mod.ts";
import Icon from "https://tfl.dev/@truffle/ui@~0.2.0/components/legacy/icon/icon.tsx";
// import {
//   observer,
//   useObservable,
// } from "https://npm.tfl.dev/@legendapp/state@~0.19.0/react";

import {
  chromeIconPath,
  firefoxIconPath,
  safariIconPath,
} from "../../utils/icons.ts";
import { getBrowser } from "../../utils/browser.ts";
import styleSheet from "./home.scss.js";

type HomeProps = {
  avatarUrl: string;
  creatorName: string;
  links: Array<{ name: string; url: string; iconPath: string }>;
};

type Browser = {
  keys: string[];
  name: string;
  url?: string;
  iconPath: string;
};

const browsers: Browser[] = [
  {
    keys: ["chrome", "edge", "opera"],
    name: "Chrome",
    iconPath: chromeIconPath,
    url:
      "https://chrome.google.com/webstore/detail/truffle/bkkjeefjfjcfdfifddmkdmcpmaakmelp",
  },
  {
    keys: ["firefox"],
    name: "Firefox",
    iconPath: firefoxIconPath,
    url: "https://v2.truffle.vip/firefox/latest.xpi",
  },
  {
    keys: ["safari"],
    name: "Safari",
    iconPath: safariIconPath,
  },
];

const Home = ({ avatarUrl, creatorName, links }: HomeProps) => {
  useStyleSheet(styleSheet);
  useGoogleFontLoader(() => ["Inter"]);

  const browserKey = getBrowser();
  const browser: Browser =
    browsers.find(({ keys }) => keys.includes(browserKey)) || browsers[0];
  const alternatives = browsers.filter(({ keys }) =>
    !keys.includes(browserKey)
  );

  return (
    <div className="c-home">
      <div className="container">
        <div className="profile">
          <div
            className="avatar"
            style={{ backgroundImage: `url(${avatarUrl})` }}
          />
          <div className="name">{creatorName}</div>
        </div>
        <div className="get-truffle">
          <div className="logo" />
          <div className="description">
            Install the Truffle extension to see when {creatorName} is live
          </div>
          <div className="button">
            <Button
              iconPath={browser.iconPath}
              text={`Get for ${browser.name}`}
              href={browser.url}
            />
          </div>
          <div className="alternatives">
            <div className="text">Also on:</div>
            {alternatives.map((alternative) => (
              <div className="alternative">
                <Button
                  iconPath={alternative.iconPath}
                  iconSize="20px"
                  text={alternative.name}
                  href={alternative.url}
                  style="outline"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="section-header">My links</div>
        <div className="links">
          {links.map((link) => (
            <a className="link" href={link.url}>
              {link.iconPath
                ? (
                  <div className="icon">
                    <Icon icon={link.iconPath} />
                  </div>
                )
                : null}
              <div className="text">{link.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

type ButtonProps = {
  text: string;
  href?: string;
  style?: string;
  iconPath?: string;
  iconSize?: string;
};

function Button(
  { text, href, iconPath, iconSize = "24px", style = "primary" }: ButtonProps,
) {
  const Element = href ? "a" : "button" as keyof JSX.IntrinsicElements;
  return (
    <Element className={`c-button ${style}`} href={href}>
      {iconPath && (
        <div className="icon">
          <Icon icon={iconPath} size={iconSize} />
        </div>
      )}
      {text}
    </Element>
  );
}

export default Home;
