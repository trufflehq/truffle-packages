import React from 'https://npm.tfl.dev/react'

const DEFAULT_FONT_FAMILY = 'Poppins, sans-serif'

export default function ThemeComponent ({
  colorBgPrimary = '#050D13',
  colorBgSecondary = '#161F2C',
  colorBgTertiary = '#2D394A',
  colorBgOverlay = 'rgba(0, 0, 0, 0.4)',
  colorPrimary = '#71DBDB',
  colorSecondary = '#FF9DC6',
  gradient = 'linear-gradient(281.86deg, #71DBDB 2.63%, #ADACDD 50.48%, #FF9DC6 94.5%)',
  colorError = '#EE7171',
  colorPositive = '#60CC8C',
  colorOpt1 = '#5C9EDC',
  colorOpt2 = '#E04C70',
  colorOpt3 = '#E0A158',
  colorOpt4 = '#A0C05B',
  colorTextBgPrimary = '#FFFFFF',
  colorTextBgSecondary = '#FFFFFF',
  colorTextBgTertiary = '#FFFFFF',
  colorTextPrimary = '#000000',
  colorTextSecondary = '#000000',
  colorTextBgGradient = '#000000',
  colorDemphasizedText = 'rgba(255, 255, 255, 0.76)',
  fontFamily = DEFAULT_FONT_FAMILY
}) {
  return (
    <>
      {fontFamily === DEFAULT_FONT_FAMILY &&
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />}
      <style>
        {/* don't put quotes in this or react will escape in ssr and break hydration */}
        {`
          :root {
            /* backgrounds */
            --truffle-color-bg-primary: ${colorBgPrimary};
            --truffle-color-bg-secondary: ${colorBgSecondary};
            --truffle-color-bg-tertiary: ${colorBgTertiary};
            --truffle-color-bg-overlay: ${colorBgOverlay};
            --truffle-gradient: ${gradient};

            /* theme colors */
            --truffle-color-primary: ${colorPrimary};
            --truffle-color-secondary: ${colorSecondary};

            /* error and positive colors */
            --truffle-color-error: ${colorError};
            --truffle-color-positive: ${colorPositive};

            /* option colors */
            --truffle-color-opt-1: ${colorOpt1};
            --truffle-color-opt-2: ${colorOpt2};
            --truffle-color-opt-3: ${colorOpt3};
            --truffle-color-opt-4: ${colorOpt4};

            /* text colors */
            /*
              you should use one of these colors with the corresponding background
              e.g. if you use --truffle-color-bg-primary as the background,
              you should use --truffle-color-text-bg-primary as the text color
            */
            --truffle-color-text-bg-primary: ${colorTextBgPrimary};
            --truffle-color-text-bg-secondary: ${colorTextBgSecondary};
            --truffle-color-text-bg-tertiary: ${colorTextBgTertiary};
            --truffle-color-text-primary: ${colorTextPrimary};
            --truffle-color-text-secondary: ${colorTextSecondary};
            --truffle-color-text-gradient: ${colorTextBgGradient};
            --truffle-color-text-demphasized: ${colorDemphasizedText};

            /* font family */
            --truffle-font-family: ${fontFamily};
          }

          .truffle-text-body-1 {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 500;
            font-size: 10px;
            line-height: 24px;
            letter-spacing: 0.004em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-body-2 {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 21px;
            letter-spacing: 0.0025em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-header-1 {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 600;
            font-size: 22px;
            line-height: 33px;
            letter-spacing: 0.04em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-header-2 {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 27px;
            letter-spacing: 0.04em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-header-caps {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 27px;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-subtitle-1 {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            letter-spacing: 0.005em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-subtitle-2 {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 21px;
            letter-spacing: 0.0025em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-caption {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 500;
            font-size: 12px;
            line-height: 18px;
            letter-spacing: 0.004em;
            color: var(--truffle-color-text-bg-primary);
          }

          .truffle-text-link {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 21px;
            letter-spacing: 0.0025em;
            text-decoration-line: underline;
            color: var(--truffle-color-primary);
          }

          .truffle-text-micro {
            font-family: var(--truffle-font-family);
            font-style: normal;
            font-weight: 500;
            font-size: 10px;
            line-height: 15px;
            letter-spacing: 0.004em;
            color: var(--truffle-color-text-bg-primary);
          }
        `}
      </style>
    </>
  )
}
