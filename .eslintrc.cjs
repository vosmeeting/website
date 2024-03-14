module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    createDefaultProgram: true,
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prefer-const': 'off',
    '@typescript-eslint/unbound-method': ['error'],
    // disable prefer const
    // disable ban ts comment
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': 'warn'
  }
};
