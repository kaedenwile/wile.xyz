import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import globals from 'globals';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist/**', '**/*.gen.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser, globals: { ...globals.browser, ...globals.node } },
    plugins: { '@typescript-eslint': ts, 'react-hooks': hooks, 'react-refresh': refresh },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // TanStack route modules export route objects containing their local components.
  { files: ['src/routes/**/*.tsx'], rules: { 'react-refresh/only-export-components': 'off' } },
];
