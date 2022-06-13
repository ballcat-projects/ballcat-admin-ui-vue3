/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    './.eslintrc-auto-import.json' // auto-imports 使用
  ],
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  rules: {
    // 允许使用 any
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许使用 @ts-ignore 注释
    '@typescript-eslint/ban-ts-comment': 'off',
    // 允许空方法
    '@typescript-eslint/no-empty-function': 'off',
    // 允许非空断言
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
}
