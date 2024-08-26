import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import reactEslintRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactEslintJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactHooksEslint from 'eslint-plugin-react-hooks';

export default tsEslint.config(
  {
    ignores: ['eslint.config.js', 'vite.config.ts', 'dist/**']
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  reactEslintRecommended,
  reactEslintJsxRuntime,
  {
    plugins: {
      'react-hooks': reactHooksEslint
    },
    rules: reactHooksEslint.configs.recommended.rules
  },
  {
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.node.json', 'tsconfig.web.json'],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/require-await': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/no-unknown-property': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
);
