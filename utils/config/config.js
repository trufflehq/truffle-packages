// these are default vals and gets updated by client (sporocarp or dev setup)
const config = {
  // prod values. so sites still work if ssr errors
  IS_DEV_ENV: false,
  IS_STAGING_ENV: false,
  IS_PROD_ENV: true,
  // TODO: prod
  PUBLIC_API_URL: 'https://mycelium.staging.bio',
  API_URL: 'https://mycelium.staging.bio',
  HOSTNAME: 'sporocarp.dev'
}

export default config

export function setConfig (newConfig) {
  // update in-place, so same default-exported object can be used
  Object.assign(config, newConfig)
}
