import express from 'express'
import fs from 'fs'
import { createServer } from 'vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// import prefresh from '@prefresh/vite'
import EnvironmentPlugin from 'vite-plugin-environment'

import truffleConfig from './truffle.config.js'

const app = express()
const port = 3000

let viteServer

app.get('/*', async (req, res) => {
  if (!req.url || req.url.indexOf('/pages') === -1) {
    console.log('skip', req.url)
    return res.send('ok')
  }
  console.log('req', req.url)
  const dir = './build'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync('./build/index.jsx', `
import React from 'react'
import { render } from 'react-dom'
import { LegacyContext } from '@spore/platform'

import Page from '..${req.url}/index.jsx'

if (import.meta.hot) {
  // Vite HMR code
  import.meta.hot.accept()
}

render(<LegacyContext><Page /></LegacyContext>, document.getElementById('root'))
`, 'utf8')

  const viteConfig = {
    configFile: false,
    mode: 'development',
    resolve: {
      alias: {
        // for our dev only, need to use same preact instance for context to work
        preact: truffleConfig.preactPath,
        '@spore/platform': truffleConfig.legacyDevPlatformPath,

        react: truffleConfig.reactPath,
        'react-dom': truffleConfig.reactDomPath
      }
    },
    plugins: [
      // req to pull in spore/src/legacy_dev_platform.js
      viteCommonjs(),
      // req to pull in spore/src/legacy_dev_platform.js
      EnvironmentPlugin('all')

      // doesn't work with <Component slug=.../>
      // prefresh()
    ],
    server: {
      port: 3001
    }
  }

  // TODO: figure out "Port 3001 is in use, trying another one..."
  try {
    await viteServer?.close()
  } catch {}
  viteServer = await createServer(viteConfig)
  await viteServer.listen()

  res.send(`
<!doctype html>
<html lang="en" style="height: 100%;">
<head>
    <meta charset="UTF-8">
    <title>Truffle Example</title>
</head>
<body style="height: 100%;">
  <div id="root" style="height: 100%;"></div>
  <script>
    window.TRUFFLE_DEV_ORG_SLUG = '${process.env.ORG_SLUG}'
  </script>
  <script type="importmap">
    {
      "imports": {
        "preact": "${truffleConfig.preactPath}",
        "preact/compat": "${truffleConfig.preactCompatPath}"
      }
    }
  </script>
  <script type="module" src="http://localhost:3001/build/index.jsx"></script>
  </script>
</body>
</html>
`
  )
})

app.listen(port, () => {
  console.log(`Truffle dev environment listening on port ${port}`)
})
