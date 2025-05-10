import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import gitignore from 'eslint-config-flat-gitignore';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import * as pluginImportX from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  gitignore(),

  eslintConfigPrettier,

  // base config
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: {
      js,
      'simple-import-sort': simpleImportSort,
      // drizzle: fixupPluginRules(drizzle),
    },
    extends: ['js/recommended' /* , 'drizzle/recommended' */],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-namespace': 'off',

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      'import-x/no-dynamic-require': 'warn',
      'import-x/no-deprecated': 'warn',
      'import-x/no-named-as-default-member': 'off',
      'import-x/default': 'off',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],

      'testing-library/no-debugging-utils': 'off',

      'react/prop-types': 'off',

      // force type imports
      '@typescript-eslint/consistent-type-imports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // dom tests
  {
    files: ['src/app/**/*.test.{js,mjs,cjs,ts,jsx,tsx}'],
    ...testingLibrary.configs['flat/react'],
  },

  // vitest tests
  {
    files: ['src/**/*.test.{js,mjs,cjs,ts,jsx,tsx}'],
    ...vitest.configs.recommended,
  },

  // client config
  {
    files: ['src/app/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'import-x/no-nodejs-modules': 'error',
    },
  },

  // commonjs
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
