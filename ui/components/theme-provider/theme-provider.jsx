import React from 'react'

export default function ThemeProvider ({
  children,
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
  colorText = '#FFFFFF',
  colorDemphasizedText = 'rgba(255, 255, 255, 0.76)'
}) {
  return (
    <>
      <style>
        {`
          :root {
            --truffle-color-bg-primary: ${colorBgPrimary};
            --truffle-color-bg-secondary: ${colorBgSecondary};
            --truffle-color-bg-tertiary: ${colorBgTertiary};
            --truffle-color-bg-overlay: ${colorBgOverlay};
            --truffle-color-primary: ${colorPrimary};
            --truffle-color-secondary: ${colorSecondary};
            --truffle-gradient: ${gradient};
            --truffle-color-error: ${colorError};
            --truffle-color-positive: ${colorPositive};
            --truffle-color-opt-1: ${colorOpt1};
            --truffle-color-opt-2: ${colorOpt2};
            --truffle-color-opt-3: ${colorOpt3};
            --truffle-color-opt-4: ${colorOpt4};
            --truffle-color-text: ${colorText};
            --truffle-color-demphasized-text: ${colorDemphasizedText};
          }
        `}
      </style>
      { children }
    </>
  )
}
