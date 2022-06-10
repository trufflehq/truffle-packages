import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    esmExternals: true,
    urlImports: ['https://tfl.dev/', 'https://esm.sh/', 'https://jspm.io/', 'https://cdn.skypack.dev/', 'https://cdn.bio/']
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }

    // https://nanxiaobei.medium.com/disable-css-modules-in-next-js-project-756835172b6e
    // disable css module req
    config.module.rules[3].oneOf.forEach((one) => {
      if (!`${one.issuer?.and}`.includes('_app')) return
      one.issuer.and = [path.resolve()]
    })

    // don't import ws on client
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(ws|async_hooks)$/
        })
      )
    }

    // attempt at getting react pulled in from cdn url, so modules can share react instance
    // config.externals = [...config.externals, 'react']

    // Important: return the modified config
    return config
  }
}

export default nextConfig
