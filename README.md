# React Webcomponent 生成器

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Version](https://img.shields.io/badge/react-%5E18.2.0-blue)](https://reactjs.org/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.14.0-green)](https://nodejs.org/)

基于 Create React App 构建的 Webcomponent 组件生成解决方案，提供高效的组件开发与构建体验。

## ✨ 功能特性

- 🚀 快速创建 React Web 组件
- 📦 开箱即用的构建配置
- ⚡ 支持热重载开发模式
- 📈 生产环境优化构建
- 🔧 可扩展的配置选项

## 📦 环境要求

- Node.js >= 16.14
- Yarn >= 1.22 (推荐) 或 npm >= 8.5

## 🛠️ 安装与使用

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

## 📂 项目结构

react-webcomponent-generator/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── components/  # 公共组件
│   ├── utils/       # 工具函数
│   └── ...         
├── .eslintrc       # 代码规范配置
└── package.json    # 依赖配置