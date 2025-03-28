# @bdlite/table

一个基于 React 和 Webcomponent 的高性能表格组件，支持大数据量渲染和灵活的配置。

## 安装

使用 npm 或 yarn 安装：

```bash
npm install @bdlite/table
# 或
yarn add @bdlite/table
```

## 使用方法

在项目中引入并使用：

```html
<react-base-table></react-base-table>
```

### React 项目中使用

```tsx
import React from 'react';
import ReactBaseTable from '@bdlite/table';

function App() {
  const columns = [
    { title: 'Name', dataKey: 'name', width: 150 },
    { title: 'Age', dataKey: 'age', width: 100 },
  ];
  const data = [
    { name: 'John', age: 28 },
    { name: 'Jane', age: 32 },
  ];

  return <ReactBaseTable columns={columns} data={data} />;
}

export default App;
```

### Vue 项目中使用

在 Vue 项目中，可以通过 Webcomponent 使用，并直接传递对象作为 `columns` 和 `data`：

```vue
<template>
  <react-base-table :columns="columns" :data="data"></react-base-table>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { title: 'Name', dataKey: 'name', width: 150 },
        { title: 'Age', dataKey: 'age', width: 100 },
      ],
      data: [
        { name: 'John', age: 28 },
        { name: 'Jane', age: 32 },
      ],
    };
  },
};
</script>
```

### 非 React 项目中使用

通过 Webcomponent 使用，支持直接传递 JSON 字符串或对象：

```html
<!-- 使用 JSON 字符串 -->
<react-base-table
  columns='[{"title":"Name","dataKey":"name","width":150},{"title":"Age","dataKey":"age","width":100}]'
  data='[{"name":"John","age":28},{"name":"Jane","age":32}]'>
</react-base-table>

<!-- 使用对象 -->
<script>
  const columns = [
    { title: 'Name', dataKey: 'name', width: 150 },
    { title: 'Age', dataKey: 'age', width: 100 },
  ];
  const data = [
    { name: 'John', age: 28 },
    { name: 'Jane', age: 32 },
  ];
  document.querySelector('react-base-table').columns = columns;
  document.querySelector('react-base-table').data = data;
</script>
```

## 功能特点

- **高性能渲染**：支持大数据量表格的高效渲染。
- **灵活配置**：支持自定义列、分页、排序等功能。
- **Webcomponent 支持**：可在非 React 项目中直接使用。

## GitHub

项目源码托管在 GitHub：[https://github.com/svichao/react-webcomponent-generator](https://github.com/svichao/react-webcomponent-generator)

## 开源协议

本项目基于 [MIT License](LICENSE) 开源，欢迎自由使用和贡献。
