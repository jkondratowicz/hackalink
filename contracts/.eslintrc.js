module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: [
    'standard',
    'plugin:prettier/recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  overrides: [
    {
      files: ['hardhat.config.js'],
      globals: { task: true },
    },
  ],
  rules: {
    'max-len': [
      'error',
      { code: 160, ignoreTrailingComments: true, ignoreStrings: true },
    ],
    quotes: ['error', 'single', { avoidEscape: true }],
    'prettier/prettier': ['error', { singleQuote: true, 'print-width': 160 }],
  },
};
