import r2wc from '@r2wc/react-to-web-component'
import App from './App'

const headeTypes = {
  align: 'string',
  border: 'json',
  color: 'string',
  fontFamily: 'string',
  fontSize: 'number',
  fontWeight: 'string',
  height: 'number',
  show: 'boolean',
}

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
}

// props同antd pagination
const paginationProps = {
  current: 'number',
  pageSize: 'number',
  total: 'number',
}

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
  onRowExpand: 'function',
  onExpandedRowsChange: 'function',
  sortBy: 'json',
  sortState: 'json',
  onColumnSort: 'function',
  onColumnResize: 'function',
  onColumnResizeEnd: 'function',
  useIsScrolling: 'boolean',
  overscanRowCount: 'number',
  getScrollbarSize: 'function',
  onScroll: 'function',
  onEndReached: 'function',
  onEndReachedThreshold: 'number',
  onRowsRendered: 'function',
  onScrollbarPresenceChange: 'function',
  rowEventHandlers: 'json',
  ignoreFunctionInColumnCompare: 'boolean',
  components: 'json',
  chartData: 'json',
  pagination: paginationProps,
}

// r2wc类型转换：string | number | boolean | function | json
const Main = r2wc(App, { props })

customElements.define('react-base-table', Main)

export default App;
