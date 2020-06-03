module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
  },
  rules: {
    'import/named': ['off'],
    'import/prefer-default-export': ['off'],
    'import/namespace': ['off'],
    'import/no-nodejs-modules': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/ban-ts-ignore': ['off'],
    '@typescript-eslint/ban-types': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
    '@typescript-eslint/no-empty-interface': ['off'],
    '@typescript-eslint/prefer-optional-chain': ['error'],
    '@typescript-eslint/prefer-nullish-coalescing': ['warn'],
    '@typescript-eslint/member-delimiter-style': ['off'],
    quotes: ['off'],
    'arrow-body-style': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'react/prop-types': ['off'],
    'react-hooks/exhaustive-deps': ['off'],
    'unicorn/explicit-length-check': ['error'],
    'unicorn/no-array-instanceof': ['error'],
    'unicorn/throw-new-error': ['error'],
    'unicorn/error-message': ['error'],
    'react/jsx-sort-props': [
      'error',
      {
        shorthandFirst: true,
      },
    ],
  },
  extends: [
    'eslint:recommended',
    'node',
    'react-app',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  plugins: [
    'jest',
    'import',
    'react',
    'react-hooks',
    '@typescript-eslint/eslint-plugin',
    'unicorn',
  ],
  globals: {
    jest: true,
    GIF: true
  },
  env: {
    node: true,
    browser: true,
    'jest/globals': true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/core-modules': [
      '@testing-library/react'
    ]
  },
}
