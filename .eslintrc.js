module.exports = {
  extends: ['eslint-config-egg/typescript', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },

  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/semi': [2, 'never'],
    '@typescript-eslint/no-empty-function': [1],
    '@typescript-eslint/no-unused-vars': [1, { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    'no-bitwise': 0,
    'no-useless-concat': 0,
  },
}
