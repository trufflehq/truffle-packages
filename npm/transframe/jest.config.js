/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    // ts-jest configuration goes here
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig/tsconfig.base.json',
      },
    ],
    // end ts-jest configuration
  },
}