import { restrictEnvAccess } from '@personal-finance-app/eslint-config/base';
import reactConfig from '@personal-finance-app/eslint-config/react';

/** @type {import("eslint").Linter.Config} */
export default [
  ...reactConfig,
  ...restrictEnvAccess,
  {
    files: ['vite.config.ts'],
    rules: {
      'no-restricted-properties': 'off',
    },
  },
];
