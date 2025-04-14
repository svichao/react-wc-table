import r2wc from '@r2wc/react-to-web-component';
import TableWrapper from './table-wrapper';

const headeTypes = {
  align: 'string',
  border: 'json',
  color: 'string',
  fontFamily: 'string',
  fontSize: 'number',
  fontWeight: 'string',
  height: 'number',
  show: 'boolean',
};

const columnTypes = {
  className: 'string',
  headerClassName: 'string',
  style: 'object',
  title: 'string',
  dataKey: 'string',
  dataGetter: 'function',
  align: 'string', // 'left' | 'center' | 'right'
  flexGrow: 'number',
  flexShrink: 'number',
  width: 'number',
  maxWidth: 'number',
  minWidth: 'number',
  frozen: 'string', // 'left' | 'right' | true | false
  hidden: 'boolean',
  resizable: 'boolean',
  sortable: 'boolean',
  cellRenderer: 'function',
  headerRenderer: 'function',
  children: 'array',
  header: headeTypes,
  ellipsis: 'boolean',
};

// props同antd pagination
const paginationProps = {
  current: 'number',
  pageSize: 'number',
  total: 'number',
};

const borderProps = {
  horizon: 'boolean',
  vertical: 'boolean',
  color: 'string',
};

const bodyStyleProps = {
  fontSize: 'number',
  fontWeight: 'string | number',
  color: 'string',
  oddRowBgColor: 'string',
  evenRowBgColor: 'string',
};
// 大部分属性可按照react-base-table传递， https://autodesk.github.io/react-base-table/api/basetable
// 部分事件: 在vue中传递事件时，名如onXX的事件会传递失败
// 这里统一去掉on，在react中使用时会恢复onXX事件名
const props: any = {
  rowKey: 'string | number',
  columns: columnTypes,
  data: 'array',
  width: 'number',
  height: 'number',
  maxHeight: 'number',
  rowHeight: 'number',
  classPrefix: 'string',
  className: 'string',
  style: 'json',
  children: 'json',
  frozenData: 'array',
  estimatedRowHeight: 'number | json',
  headerHeight: 'number | array',
  footerHeight: 'number',
  fixed: 'boolean',
  disabled: 'boolean',
  overlayRenderer: 'function',
  emptyRenderer: 'function',
  footerRenderer: 'function',
  headerRenderer: 'function',
  headerClassName: 'string | function',
  rowClassName: 'string | function',
  headerProps: 'json | function',
  headerCellProps: 'json | function',
  rowProps: 'json | function',
  cellProps: 'json | function',
  expandIconProps: 'json | function',
  expandColumnKey: 'string',
  defaultExpandedRowKeys: 'array',
  expandedRowKeys: 'array',
  // onRowExpand: 'function',
  rowExpand: 'function',
  // onExpandedRowsChange: 'function',
  expandedRowsChange: 'function',
  sortBy: 'json',
  sortState: 'json',
  // onColumnSort: 'function',
  columnSort: 'function',
  // onColumnResize: 'function',
  columnResize: 'function',
  // onColumnResizeEnd: 'function',
  columnResizeEnd: 'function',
  useIsScrolling: 'boolean',
  overscanRowCount: 'number',
  getScrollbarSize: 'function',
  // onScroll: 'function',
  scroll: 'function',
  // onEndReached: 'function',
  endReached: 'function',
  // onEndReachedThreshold: 'number',
  endReachedThreshold: 'number',
  // onRowsRendered: 'function',
  rowsRendered: 'function',
  // onScrollbarPresenceChange: 'function',
  scrollbarPresenceChange: 'function',
  rowEventHandlers: 'json',
  ignoreFunctionInColumnCompare: 'boolean',
  components: 'json',
  chartData: 'json',
  pagination: paginationProps,
  border: borderProps, // 边框
  bodyStyle: bodyStyleProps,
  extraProps: 'json',
};

// r2wc类型转换：string | number | boolean | function | json
const Main = r2wc(TableWrapper, { props });

if (!customElements.get('react-base-table')) {
  customElements.define('react-base-table', Main);
}
