import { React, useStyleSheet } from "../../deps.ts";
import Button from "../base/button/button.tsx";

import styleSheet from "./advert.scss.js";

export interface AdvertProps {
  className: string;
  imageSrc: string;
  hashtag: string;
  tagline: string;
  buttonHref: string;
  buttonOnClick?: () => void;
  buttonText: string;
  buttonStyle: string;
}

export default function Advert(props: AdvertProps) {
  useStyleSheet(styleSheet);
  const {
    className,
    imageSrc,
    hashtag,
    tagline,
    buttonHref,
    buttonOnClick,
    buttonText,
    buttonStyle,
  } = props;

  const hrefHandler = () => {
    window.open(buttonHref, "_blank", "noopener");
  };

  return (
    <div className={`c-advert ${className}`}>
      <div className="image">
        <img src={imageSrc} alt="Ad" />
      </div>
      <div className="content">
        <div className="text">
          {/* <div className='ad'>#ad</div> */}
          <div className="ad">{hashtag}</div>
          <div className="tagline">{tagline}</div>
        </div>
        <div className="actions">
          <Button style={buttonStyle} onClick={hrefHandler ?? buttonOnClick}>{buttonText}</Button>
        </div>
      </div>
    </div>
  );
}
