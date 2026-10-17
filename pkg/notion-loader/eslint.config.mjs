import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  { ignores: ['dist/**', '**/*.gen.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser, globals: { ...globals.browser, ...globals.node } },
    plugins: { '@typescript-eslint': ts },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
    },
  },
];
