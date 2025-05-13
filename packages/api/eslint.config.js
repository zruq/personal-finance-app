import baseConfig from '@personal-finance-app/eslint-config/base';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
];
