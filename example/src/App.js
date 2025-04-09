import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ReactBaseTable } from '@bdlite/table';
import '@bdlite/table/dist/main.css'

// 检查 ReactBaseTable 是否为有效的 React 组件
if (React.isValidElement(<ReactBaseTable />)) {
  console.log('ReactBaseTable is a valid React element:', ReactBaseTable);
} else if (typeof ReactBaseTable === 'function') {
  console.log('ReactBaseTable is a valid React component function.');
} else {
  console.error('ReactBaseTable is not a valid React component:', ReactBaseTable);
}

console.log('React.createElement(ReactBaseTable): ', React.createElement(ReactBaseTable));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      dataKey: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      dataKey: 'age',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      dataKey: 'address',
      width: 100,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Unknown',
      age: null,
      address: 'Unknown',
    },
  ];

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ErrorBoundary>
          {ReactBaseTable}
          {typeof ReactBaseTable === 'function' ? (
            <ReactBaseTable
              columns={columns}
              data={data}
              rowKey="key"
            />
          ) : (
            <h1>ReactBaseTable is not a valid component.</h1>
          )}
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
