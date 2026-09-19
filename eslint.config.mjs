import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      // Ember app being replaced by this rewrite -- deleted in a later step, not worth
      // reconfiguring Ember/decorator-aware linting for code on its way out.
      'app/',
      'config/',
      'tests/',
      'ember-cli-build.js',
      'testem.js',
    ],
  },
);
