// @ts-check
const tseslint = require("typescript-eslint");
const baseConfig = require("../../eslint.config.base")

module.exports = tseslint.config(
  ...baseConfig
)
