import ConfigProvider from 'antd/es/config-provider';
import zhCN from 'antd/es/locale/zh_CN';
import ReactBaseTable from '@components/base-table'
import Pagination from '@components/page'

function App(props: any) {
  console.log('Appprops: ', props);
  const {
    container,
    pagination,
    ...rest
  } = props
  console.log('container: ', container);

  return (
    <ConfigProvider locale={zhCN}>
      <ReactBaseTable {...rest} />
      {pagination && <Pagination pagination={pagination} />}
    </ConfigProvider>
  );
}

export default App;
