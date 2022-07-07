import express from "express";
import path from "path";
import { AsyncLocalStorage } from "node:async_hooks";
import { createServer as createViteServer } from "vite";
import globalContext from 'https://tfl.dev/@truffle/global-context@1.0.0/index.js'

// url imports can't import non-url imports, so we have to pass this in...
globalContext._PRIVATE_setInstance(new AsyncLocalStorage())

const vite = await createViteServer({
  server: {
    middlewareMode: "ssr",
    // FIXME: I think we might be able to disable when this package is installed via hosted github
    // (vs installed from local)
    fs: { strict: false }
  },
});

const app = express();

app.use(vite.middlewares)

app.use('*', (req, res, next) => {
  const url = req.originalUrl

  try {
    globalContext.run({}, async () => {
      // vite doesn't like file urls :(
      const entry = (await import.meta.resolve("./server-entry.ts")).toString().replace('file://', '')
      const { render } = await vite.ssrLoadModule(entry);
      const appHtml = await render(url);
      const html = await vite.transformIndexHtml(url, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    })
  } catch (e) {
    // If an error is caught, let Vite fix the stracktrace so it maps back to
    // your actual source code.
    vite.ssrFixStacktrace(e)
    next(e)
  }
});
app.listen(3000);
