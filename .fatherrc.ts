export default {
  // more father 4 config: https://github.com/umijs/father-next/blob/master/docs/config.md
  esm: { transformer: 'babel', output: 'es' },
  cjs: { transformer: 'babel', output: 'lib' },
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', style: false }],
    ['transform-remove-console', { exclude: ['warn', 'error'] }],
  ],
};
