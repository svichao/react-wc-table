import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import Table from './table';
import zhCN from 'antd/es/locale/zh_CN';
import Pagination from './pagination';

function TableWrapper(props: any = {}) {
  const { container, pagination, ...rest } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <Table {...rest} />
      {pagination && <Pagination pagination={pagination} />}
    </ConfigProvider>
  );
}

export default TableWrapper;
