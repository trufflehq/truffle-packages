import { _, ImageByAspectRatio, React, useStyleSheet } from "../../deps.ts";
import { closeSelf, postTruffleAccessTokenToNative } from "../../shared/mod.ts";
import stylesheet from "./error-renderer.scss.js";
import Button from "../button/button.tsx";

export default function ErrorRenderer(
  { title, message }: { title?: string; message?: string },
) {
  useStyleSheet(stylesheet);

  const onClick = () => {
    // check if the oauth flow is being loaded in the ReactNative webview
    if (window?.ReactNativeWebView) {
      // want to redirect to the last embeddable page
      postTruffleAccessTokenToNative("");
    }

    closeSelf();
  };
  return (
    <div className="c-error">
      <div className="inner">
        <ImageByAspectRatio
          imageUrl={"https://cdn.bio/assets/images/features/browser_extension/truffle-error.svg"}
          widthPx={72}
          height={72}
          aspectRatio={1}
        />
        {title
          ? (
            <div className="title">
              {title}
            </div>
          )
          : null}
        {message
          ? (
            <div className="message">
              {message}
            </div>
          )
          : null}
        <Button
          style="pink"
          css={{
            fontWeight: 700,
          }}
          className="try-again"
          onClick={onClick}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
