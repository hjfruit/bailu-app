module.exports = {
  env: {
    browser: false,
    node: true,
    es2022: true,
  },
  extends: [
    '@fruits-chain/eslint-config-rn',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['import', '@typescript-eslint'],
  rules: {
    'import/no-unresolved': [2, { ignore: ['^@/', 'dist'] }],
    'import/first': 1,
    '@typescript-eslint/no-empty-interface': 0,
    'import/order': [
      1,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
      },
    ],
    '@typescript-eslint/consistent-type-imports': 1,
  },
  settings: {
    'import/ignore': ['react-native'],
  }
}
