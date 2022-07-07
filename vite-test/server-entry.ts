import "https://npm.tfl.dev/@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "https://npm.tfl.dev/@microsoft/fast-ssr";
import { html } from "https://npm.tfl.dev/@microsoft/fast-element@beta";
import path from "path";
// import { html, unsafeStatic } from "https://npm.tfl.dev/lit-html@2/static";

// fails with Cannot access 'LitElementRenderer' before initialization in node_modules/@lit-labs/ssr/lib/render-lit-html.js
// on skypack: [Package Error] \"module\" does not exist. (Imported by \"@lit-labs/ssr\")
// on npm.tfl.dev [ERR_NETWORK_IMPORT_DISALLOWED]: import of 'undefined'
// import { LitElementRenderer } from "@lit-labs/ssr/lib/lit-element-renderer.js";

import { getRouter, setRoutes } from "./router.ts";

const { templateRenderer, defaultRenderInfo, elementRenderer } = fastSSR();

export async function render(url) {
  const baseHtml = await getBaseHtml(url);
  try {
    const result = templateRenderer.render(baseHtml, {
      ...defaultRenderInfo,
      // elementRenderers: [elementRenderer, LitElementRenderer],
    });

    let htmlStr = "";
    for (const value of result) {
      htmlStr += value;
    }
    return htmlStr;
  } catch (err) {
    console.log("err", err);

    return baseHtml;
  }
}

async function getBaseHtml(url) {
  console.log("base", url);

  // const { default: Component } = await import(
  //   "./components/sandbox/sandbox.entry.tsx"
  // );
  let componentTemplate, nestedRoutes;
  try {
    ({ nestedRoutes } = await import("./fs-router-server.ts"));
    setRoutes(nestedRoutes);
    const router = getRouter();

    componentTemplate = await router.resolve(url);

    // const { default: Component } = await import(
    //   path.resolve(nestedRoutes.page)
    // );
    // componentTemplate = html`<${Component}></${Component}>`;
  } catch (err) {
    console.log("err", err);
    componentTemplate = "";
  }

  const { default: themeTemplate } = await import(
    "https://tfl.dev/@truffle/ui@0.0.2/components/theme/theme-template.js"
  );

  const clientEntrySrc = new URL(
    "./client-entry.ts",
    import.meta.url,
  )
    .toString()
    .replace("file://", "");

  console.log("comptemp", componentTemplate);

  return html`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
    </head>
    <body>
      ${themeTemplate}
      <div id="root">${componentTemplate}</div>
      <script type="module" src="${clientEntrySrc}"></script>
      <script>window._truffleRoutes = ${JSON.stringify(nestedRoutes)};</script>
    </body>
    </html>`;
}
