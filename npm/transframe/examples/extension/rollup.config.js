import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
// we forked this bc plugin doesn't support declarativeNetRequestWithHostAccess yet
import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension';
import { emptyDir } from 'rollup-plugin-empty-dir';
import zip from 'rollup-plugin-zip';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import packageJson from './package.json';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getConfig(browser, env) {
  return {
    input: browser === 'chrome' ? 'src/manifest.v3.ts' : 'src/manifest.v2.ts',
    output: {
      dir: 'dist/' + browser,
      format: 'esm',
      // chunkFileNames: path.join('chunks', '[name]-[hash].js'),
      // manualChunks: () => 'all.js'
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.VERSION': JSON.stringify(packageJson.version),
        'process.env.BROWSER': JSON.stringify(browser),
        LOGGING: JSON.stringify(!isProduction),
        ...env,
        preventAssignment: true,
      }),
      postcss({
        plugins: [
          require('postcss-modules')({
            getJSON: () => undefined,
            scopeBehaviour: 'global',
          }),
        ],
      }),
      chromeExtension(),
      // Adds a Chrome extension reloader during watch mode
      simpleReloader(),
      resolve({
        jsnext: true,
        browser: true,
        extensions: ['.js', '.jsx', '.png'],
      }),
      json(),
      commonjs(),
      typescript({
        include: [
          '../shared/src/**/*.ts',
          'src/**/*.ts',
          'src/**/*.tsx',
          'src/global.d.ts',
          'src/modules.d.ts',
        ],
      }),
      // Import images as base64
      image(),
      // Empties the output dir before a new build
      emptyDir(),
      isProduction && terser(),
      // Outputs a zip file in ./releases
      isProduction && zip({ dir: `releases/${browser}` }),
    ],
  };
}

/** @type {import('rollup').RollupOptions} */

export default (cliArgs) => {
  const browsers = [];
  for (const arg of ['Chrome', 'Firefox', 'Safari']) {
    if (cliArgs['config' + arg] === true) {
      browsers.push(arg.toLowerCase());
    }
  }
  const config = browsers.map((browser) => getConfig(browser, {}));
  return config;
};
