# React WebComponent Generator

一个用于生成 React WebComponent 的工具，帮助开发者快速创建可复用的 Web 组件。

## 特性

- 支持将 React 组件打包为 WebComponent。
- 简单易用，快速集成。
- 支持自定义配置。

## 安装

使用 npm 或 yarn 安装：

```bash
npm install @bdlite/table
# 或者
yarn add @bdlite/table
```

## 使用方法

1. 在项目中导入工具：

   ```javascript
   import { generateWebComponent } from '@bdlite/table';
   ```

2. 使用工具将 React 组件转换为 WebComponent：

   ```javascript
   const MyWebComponent = generateWebComponent(
     MyReactComponent,
     'my-web-component',
   );
   ```

3. 在 HTML 中使用生成的 WebComponent：

   ```html
   <my-web-component></my-web-component>
   ```

## 示例

请参考 `examples` 文件夹中的示例代码，了解如何在实际项目中使用该工具。

## 贡献

欢迎提交问题和贡献代码！请确保在提交 PR 前运行所有测试并遵循项目的代码规范。

## 许可证

本项目基于 [MIT License](LICENSE) 许可。
