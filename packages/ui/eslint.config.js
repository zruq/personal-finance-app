import baseConfig from '@personal-finance-app/eslint-config/base';
import reactConfig from '@personal-finance-app/eslint-config/react';

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
];
