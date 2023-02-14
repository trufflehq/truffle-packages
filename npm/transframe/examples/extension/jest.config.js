const { pathsToModuleNameMapper } = require('ts-jest');

const tsconfig = require('./tsconfig.json');

module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '/test/.*\\.test\\.ts$',
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
