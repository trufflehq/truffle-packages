import { React, ExternalLinkIcon, useStyleSheet } from "../../deps.ts";

import stylesheet from "./external-link.scss.js";

export default function ExternalLink({
  link,
  text,
}: {
  link: string;
  text: React.ReactNode;
}) {
  useStyleSheet(stylesheet);

  const _link = link.slice(0, 4) !== 'http' ? `https://${link}` : link

  const handleOpen = () => {
      window?.open(link);
  }
  return (
    <div className="link" onClick={handleOpen}>
      <a target="_blank" href={link}>
        {text}
      </a>
      <ExternalLinkIcon />
    </div>
  );
}
