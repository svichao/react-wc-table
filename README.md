# React Webcomponent 生成器

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue)](https://reactjs.org/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.14.0-green)](https://nodejs.org/)

## 项目简介

React Webcomponent 生成器是一个基于 Create React App 构建的解决方案，用于快速生成 Webcomponent 组件。它封装了 `react-base-table` 组件，支持高性能表格组件的开发，提供了灵活的配置和扩展能力。

## 功能特点

- **高性能表格组件**：基于 `react-base-table`，支持大数据量的高效渲染。
- **Webcomponent 支持**：通过 `@r2wc/react-to-web-component` 将 React 组件转换为 Webcomponent。
- **Ant Design 集成**：内置 Ant Design 支持，提供丰富的 UI 组件。
- **灵活的配置**：支持自定义列、分页、排序等功能。
- **现代开发工具链**：基于 React 18 和 TypeScript，支持最新的开发特性。

## 环境要求

- Node.js >= 16.14
- Yarn >= 1.22（推荐）或 npm >= 8.5

## 安装与使用

### 安装依赖

```bash
yarn install

# 或
npm install
```

### 开发模式

```bash
yarn start
```

### 生产构建

```bash
yarn build
```

## 项目结构

```
react-webcomponent-generator/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── components/  # 公共组件
│   ├── utils/       # 工具函数
│   └── ...         
├── .eslintrc       # 代码规范配置
└── package.json    # 依赖配置
```

## 使用说明

### 自定义表格组件

该项目封装了 `react-base-table`，支持以下功能：

- **列配置**：通过 `columns` 属性自定义列的样式、宽度、对齐方式等。
- **分页**：支持 Ant Design 风格的分页，通过 `pagination` 属性配置。
- **事件处理**：支持行点击、列排序等事件的回调处理。

### Webcomponent 集成

通过 `@r2wc/react-to-web-component`，可以将 React 组件转换为 Webcomponent，方便在非 React 项目中使用。

示例：

```html
<react-base-table></react-base-table>
```

## 开源协议

本项目基于 [MIT License](LICENSE) 开源，欢迎自由使用和贡献。
