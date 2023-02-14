type ManifestV3 = Omit<chrome.runtime.ManifestV3, 'permissions'> & {
  permissions: (
    | chrome.runtime.ManifestPermissions
    // definitely-typed doesn't have this yet
    | 'declarativeNetRequestWithHostAccess'
  )[];
};

const manifest: ManifestV3 = {
  name: 'test-webextension',
  version: process.env.npm_package_version || '',
  manifest_version: 3,
  background: {
    service_worker: 'background.ts',
  },
  action: {
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
    'unlimitedStorage',
    'gcm',
    'notifications',
    // this lets us modify headers for sites we have host_permissions for
    // it does not add an additional warning to the user.
    // declarativeNetRequest does add an additional warning ("Block content on any page")
    'declarativeNetRequestWithHostAccess',
  ],
  host_permissions: ['http://*/*', 'https://*/*'],
  web_accessible_resources: [],
};

export default manifest;
