// @ts-check
const tseslint = require("typescript-eslint");
const baseConfig = require("../../eslint.config.base")

module.exports = tseslint.config(
  ...baseConfig,
  {
    ignores: ['src/test/lib/manual.spec.ts']
  }
)
