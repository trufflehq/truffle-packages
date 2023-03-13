const manifest: chrome.runtime.ManifestV2 = {
  name: 'test-webextension',
  manifest_version: 2,
  version: process.env.npm_package_version || '',
  background: {
    scripts: ['background.ts'],
  },
  browser_action: {
    default_popup: 'popup/index.html',
  },
  icons: {
    '16': 'assets/icon16.png',
    '48': 'assets/icon48.png',
    '128': 'assets/icon128.png',
  },
  description: 'Enhance your livestream viewing experience',
  content_scripts: [
    {
      js: ['content/all/index.ts'],
      run_at: 'document_start',
      matches: [
        '*://*/*',
      ],
      all_frames: true,
    }
  ],
  permissions: [
    'cookies',
    'storage',
    'tabs',
    'activeTab',
    'unlimitedStorage',
    'notifications',
    'webRequest',
    'webRequestBlocking',
    'http://*/*',
    'https://*/*',
  ],
  // web_accessible_resources: [],
};

export default manifest;
