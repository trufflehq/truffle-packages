import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "https://npm.tfl.dev/@microsoft/fast-ssr";
import { html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
// import { html, unsafeStatic } from "https://npm.tfl.dev/lit-html@2/static";

// fails with Cannot access 'LitElementRenderer' before initialization in node_modules/@lit-labs/ssr/lib/render-lit-html.js
// on skypack: [Package Error] \"module\" does not exist. (Imported by \"@lit-labs/ssr\")
// on npm.tfl.dev [ERR_NETWORK_IMPORT_DISALLOWED]: import of 'undefined'
// import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js";

const { templateRenderer, defaultRenderInfo, elementRenderer } = fastSSR();

export async function render (url) {
  const result = templateRenderer.render(await getBaseHtml(url),
    {
      ...defaultRenderInfo,
      // elementRenderers: [elementRenderer, LitElementRenderer],
    },
  );

  let htmlStr = "";
  for (const value of result) {
    htmlStr += value;
  }
  return htmlStr
}

async function getBaseHtml() {
  const { default: Component } = await import("./components/sandbox/sandbox.entry.tsx");
  const { default: themeTemplate } = await import("https://tfl.dev/@truffle/ui@0.0.2/components/theme/theme-template.js");

  return html`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title></title>
  </head>
  <body>
    ${themeTemplate}
    <${Component}></${Component}>
    <script type="module" src="/components/sandbox/sandbox.entry.tsx"></script>
  </body>
  </html>`;
}

/*

    <script type="module">
      import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'
      import Component from "./components/sandbox/sandbox.entry.tsx";
  
      globalContext.setGlobalValue({});
  
      document.getElementById("root").innerHTML = \`<\${Component}></\${Component}>\`
    </script>
    <!-- FIXME: get theme component working -->
    <link rel="stylesheet" href="https://tfl.dev/@truffle/ui@0.0.2/components/theme/variables.css">
    <style>
      :root {
        background: var(--tfl-color-bg-fill);
        color: var(--tfl-color-on-bg-fill);
        font-family: var(--tfl-font-family-body-sans);
      }
      :not(:defined) {
        visibility: hidden;
      }
    </style>
    */