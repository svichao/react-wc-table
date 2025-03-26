const path = require('path');
const TerserPlugin = require('terser-webpack-plugin'); // 需要引入 Terser 插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 可添加其他别名
      '@components': path.resolve(__dirname, 'src/components')
    },
    // 新增 configure 属性
    configure: (webpackConfig) => {
      const terserPlugin = webpackConfig.optimization.minimizer.find(
        (plugin) => plugin instanceof TerserPlugin
      );

      if (terserPlugin) {
        // 确保配置结构存在
        terserPlugin.options = {
          ...terserPlugin.options,
          terserOptions: {
            ...(terserPlugin.options?.terserOptions || {}),
            compress: {
              ...(terserPlugin.options?.terserOptions?.compress || {}),
              drop_console: false // 保留 console
            }
          }
        };
      }

      // 修改 CSS 文件名（移除哈希）
      const cssPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      );
      if (cssPlugin) {
        cssPlugin.options.filename = '[name].css';
      }

      return ({
        ...webpackConfig,
        output: {
          ...webpackConfig.output, // 保留原有 output 配置
          path: path.resolve(__dirname, 'dist'), // 自定义输出目录
          filename: 'main.js', // 修改为固定文件名 main.js
        },
      })

    },
    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /node_modules\/antd/, // 排除 antd 的全局样式
          use: [ 'style-loader', 'css-loader' ]
        }
      ]
    }

  }
};