/* eslint-env node */
/** @type {import('eslint').Linter.Config} */
module.exports = {
    env: {
        node: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    root: true,
    rules: {
        // 'func-style': ['error', 'declaration'],
        'yoda': ['error', 'never'],
        'block-scoped-var': 'error',
        'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
        'no-var': 'error',
        'prefer-const': 'warn',
        'prefer-object-spread': 'warn',
        'no-await-in-loop': 'warn',
        '@typescript-eslint/no-var-requires': 'off',
        'no-empty': ['error', { 'allowEmptyCatch': true }]
    }
}