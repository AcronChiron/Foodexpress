module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
  },
  rules: {
    'no-console': 'off',
    'prettier/prettier': ['error'],
  },
};
