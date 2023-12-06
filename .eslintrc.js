module.exports = {
  root: true,
  extends: ['@vben'],
  rules: {
    'no-undef': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // 不允许使用any类型
  },
};
