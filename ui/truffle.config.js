const config = {
  orgId: '00000000-0000-0000-0000-000000000000',
  packageId: '00000000-0000-0000-0000-000000000000',
  packageVersion: '0.0.1',

  // pull components from prod zygote
  // apiUrl: 'https://zygote.spore.build/graphql',
  // apiUrl: 'https://zygote.staging.bio/graphql',
  apiUrl: 'http://localhost:50330/graphql',

  // LOCAL DEV spore
  // legacyDevPlatformPath: '/home/austin/dev/spore/src/legacy_dev_platform.js',
  // preactPath: '/home/austin/dev/spore/node_modules/preact',
  // preactCompatPath: '/home/austin/dev/spore/node_modules/preact/compat',
  // reactPath: 'preact/compat',
  // reactDomPath: 'preact/compat'

  // HOSTED spore
  // legacyDevPlatformPath: 'https://cdn.bio/scripts/legacy_dev_platform_production_en.js', // PROD zygote
  // test using staging data
  legacyDevPlatformPath: 'https://cdn.bio/scripts/legacy_dev_platform_staging_en.js', // STAGING zygote
  // legacyDevPlatformPath: 'https://cdn.bio/scripts/legacy_dev_platform_dev_en.js', // DEV/localhost:50330 zygote
  preactPath: 'https://cdn.skypack.dev/preact@10.4.7',
  preactCompatPath: 'https://cdn.skypack.dev/preact@10.4.7/compat',
  reactPath: 'https://cdn.skypack.dev/preact@10.4.7/compat',
  reactDomPath: 'https://cdn.skypack.dev/preact@10.4.7/compat'
}

export default config
