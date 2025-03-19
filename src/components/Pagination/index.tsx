import React from "react"
import Pagination from 'antd/es/pagination'
function App(props) {
  console.log('props111: ', props);
  const {
    pagination = {},
  } = props
  const {
    total = 0,
    showSizeChanger = true,
    showQuickJumper = true,
    showTotal = () => `共 ${total} 条`,
    size = 'small',
    ...restPagination
  } = pagination

  return (
      <Pagination 
        total={total}
        showSizeChanger={showSizeChanger}
        showQuickJumper={showQuickJumper}
        showTotal={showTotal}
        size={size}
        {...restPagination}
      />
  );
}

export default App;
