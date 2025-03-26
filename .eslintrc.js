module.exports = {
  extends: [ './node_modules/@bdlite/fe-lint/lib/eslint.js' ],
  rules: {
    'func-names': 'off', // 不能使用匿名函数
    'no-param-reassign': 'off',
    'no-multi-spaces': 'error',
    'eqeqeq': 'off',
    'guard-for-in': 'off',
    'space-in-parens': 2,
    'comma-spacing': 2,
    'no-nested-ternary': 'off',
    'prefer-const': [ 'error', { 'destructuring': 'all', 'ignoreReadBeforeAssign': true } ],
    'no-unnecessary-boolean-literal-compare': 'off',
    'no-shadow': 'off',
    'max-classes-per-file': 'off'
  },
}
