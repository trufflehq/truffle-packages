// these are default vals and gets updated by client (sporocarp or dev setup)
const config = {
  // TODO: change to prod values. so sites still work if ssr errors
  IS_DEV_ENV: true,
  IS_STAGING_ENV: false,
  IS_PROD_ENV: false,
  PUBLIC_API_URL: 'https://mycelium.staging.bio',
  API_URL: 'https://mycelium.staging.bio',
  HOSTNAME: 'sporocarp.dev'
}

export default config

export function setConfig (newConfig) {
  // update in-place, so same default-exported object can be used
  Object.assign(config, newConfig)
}
