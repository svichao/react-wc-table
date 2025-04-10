// @ts-nocheck
import React from 'react';
import Pagination from 'antd/es/pagination';
import './style.less';

function BaseTablePagination(props) {
  const { pagination = {} } = props;
  const {
    current,
    pageSize,
    pageNum,
    total = 0,
    showSizeChanger = true,
    showQuickJumper = true,
    showTotal = () => `共 ${total} 条`,
    size = 'small',
    pageSizeOptions = [10, 20, 30, 50, 100, 200, 500],
    ...restPagination
  } = pagination;

  return (
    <div className="bdlite-pagination-wrapper">
      <Pagination
        current={current || pageNum || 1}
        pageSize={pageSize || 10}
        total={total}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        showTotal={showTotal}
        size={size}
        pageSizeOptions={pageSizeOptions}
        {...restPagination}
      />
    </div>
  );
}

export default BaseTablePagination;
