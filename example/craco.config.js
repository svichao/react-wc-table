const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@rootSrc': path.resolve(__dirname, '../src'), // 添加对外部路径的支持
    },
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.css$/,
        enforce: 'pre',
        loader: 'source-map-loader',
        // 移除 exclude 配置，确保 source map 被正确加载
      });
      webpackConfig.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        loader: 'source-map-loader',
        // 移除 exclude 配置，确保 source map 被正确加载
      });
      return webpackConfig;
    },
  },
};