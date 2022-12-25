import { React, useEffect } from "../../../deps.ts";
import { useGoogleFontLoader } from "./hooks.ts";
const DEFAULT_FONT_FAMILY = "Poppins";
const SECONDARY_FONT_FAMILY = "Roboto";

function ThemeComponent({
  colorBgPrimary = "#050D13",
  colorBgSecondary = "#1F1F1F",
  colorBgTertiary = "#292929",
  colorBgOverlay = "rgba(0, 0, 0, 0.4)",
  colorPrimary = "#71DBDB",
  colorSecondary = "#FF9DC6",
  gradient =
    "linear-gradient(281.86deg, #71DBDB 2.63%, #ADACDD 50.48%, #FF9DC6 94.5%)",
  colorError = "#EE7171",
  colorPositive = "#60CC8C",
  colorOpt1 = "#5C9EDC",
  colorOpt2 = "#E04C70",
  colorOpt3 = "#E0A158",
  colorOpt4 = "#A0C05B",
  colorTextBgPrimary = "#FFFFFF",
  colorTextBgSecondary = "#FFFFFF",
  colorTextBgTertiary = "#FFFFFF",
  colorTextPrimary = "#000000",
  colorTextSecondary = "#000000",
  colorTextBgGradient = "#000000",
  colorTextError = "#000000",
  colorTextPositive = "#000000",
  colorDemphasizedText = "rgba(255, 255, 255, 0.76)",
  fontFamily = DEFAULT_FONT_FAMILY,
  secondaryFontFamily = SECONDARY_FONT_FAMILY,
}) {
  useGoogleFontLoader(() => [fontFamily, secondaryFontFamily, "Inter"], [
    fontFamily,
    secondaryFontFamily,
  ]);
  return (
    <>
      <style>
        {`
        :host {
          /* backgrounds */
          --mm-color-bg-primary: ${colorBgPrimary};
          --mm-color-bg-secondary: ${colorBgSecondary};
          --mm-color-bg-tertiary: ${colorBgTertiary};
          --mm-color-bg-overlay: ${colorBgOverlay};
          --mm-gradient: ${gradient};

          /* theme colors */
          --mm-color-primary: ${colorPrimary};
          --mm-color-secondary: ${colorSecondary};

          /* error and positive colors */
          --mm-color-error: ${colorError};
          --mm-color-positive: ${colorPositive};

          /* option colors */
          --mm-color-opt-1: ${colorOpt1};
          --mm-color-opt-2: ${colorOpt2};
          --mm-color-opt-3: ${colorOpt3};
          --mm-color-opt-4: ${colorOpt4};

          /* text colors */
          /*
            you should use one of these colors with the corresponding background
            e.g. if you use --mm-color-bg-primary as the background,
            you should use --mm-color-text-bg-primary as the text color
          */
          --mm-color-text-bg-primary: ${colorTextBgPrimary};
          --mm-color-text-bg-secondary: ${colorTextBgSecondary};
          --mm-color-text-bg-tertiary: ${colorTextBgTertiary};
          --mm-color-text-primary: ${colorTextPrimary};
          --mm-color-text-secondary: ${colorTextSecondary};
          --mm-color-text-gradient: ${colorTextBgGradient};
          --mm-color-text-demphasized: ${colorDemphasizedText};
          --mm-color-text-error: ${colorTextError};
          --mm-color-text-positive: ${colorTextPositive};

          /* font family */
          --mm-font-family: ${fontFamily};
          --mm-secondary-font-family: ${secondaryFontFamily};


          /* Truffle UI overrides */
          --tfl-color-surface-border-selected: var(--mm-color-primary);
        }

        :host .mm-text-body-1 {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 19px;
          letter-spacing: 0.005em;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-body-2 {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 21px;
          letter-spacing: 0.0025em;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-header-1 {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 600;
          font-size: 22px;
          line-height: 33px;
          letter-spacing: 0.04em;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-header-2 {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 600;
          font-size: 18px;
          line-height: 27px;
          letter-spacing: 0.04em;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-header-caps {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 600;
          font-size: 18px;
          line-height: 27px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-subtitle-1 {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.005em;
        }

        :host .mm-text-subtitle-2 {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 21px;
          letter-spacing: 0.0025em;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-caption {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 500;
          font-size: 12px;
          line-height: 18px;
          letter-spacing: 0.004em;
          color: var(--mm-color-text-bg-primary);
        }

        :host .mm-text-link {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 21px;
          letter-spacing: 0.0025em;
          text-decoration-line: underline;
          color: var(--mm-color-secondary);
          cursor: pointer;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        :host .mm-text-micro {
          font-family: var(--mm-font-family);
          font-style: normal;
          font-weight: 500;
          font-size: 10px;
          line-height: 15px;
          letter-spacing: 0.004em;
          color: var(--mm-color-text-bg-primary);
        }

        /* SCROLLBAR CUSTOMIZATION */

        /* width */
        ::-webkit-scrollbar {
          width: 12px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        /* Handle */
        ::-webkit-scrollbar-thumb {
          border-radius: 100px;
          border: 4px solid transparent;
          background-clip: content-box;
          background-color: rgba(255, 255, 255, 0.25);;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.15);;
        }

        input, textarea, button, select, a {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
      `}
      </style>
    </>
  );
}
export { ThemeComponent as default };
