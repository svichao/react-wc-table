import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import Table from './table';
import zhCN from 'antd/es/locale/zh_CN';
import Pagination from './pagination';

function TableWrapper(props: any = {}) {
  const {
    container,
    pagination,
    onRowExpand,
    expandedRowsChange: onExpandedRowsChange,
    columnSort: onColumnSort,
    columnResize: onColumnResize,
    columnResizeEnd: onColumnResizeEnd,
    scroll: onScroll,
    endReached: onEndReached,
    endReachedThreshold: onEndReachedThreshold,
    rowsRendered: onRowsRendered,
    scrollbarPresenceChange: onScrollbarPresenceChange,
    ...rest
  } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <Table
        onExpandedRowsChange={onExpandedRowsChange}
        onColumnSort={onColumnSort}
        onColumnResize={onColumnResize}
        onColumnResizeEnd={onColumnResizeEnd}
        onScroll={onScroll}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onRowsRendered={onRowsRendered}
        onScrollbarPresenceChange={onScrollbarPresenceChange}
        {...rest}
      />
      {pagination && <Pagination pagination={pagination} />}
    </ConfigProvider>
  );
}

export default TableWrapper;
