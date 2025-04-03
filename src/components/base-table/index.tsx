// import ReactBaseTable, { SortOrder } from 'react-base-table'
import ReactBaseTable from 'react-base-table'
import { groupHeader, sort } from './features'
import { useTablePipeline } from './pipeline';
import DefaultHeaderRenderer from './features/default-header-renderer';
import classnames from 'classnames'
import { handleColumnRenderer } from './features/config';
import 'react-base-table/styles.css'
import './style.scss'

const DEFAULT_BORDER_COLOR = '#D8E0E8'
const DEFAULT_ODD_ROW_BG_COLOR = '#FFF'
const DEFAULT_EVEN_ROW_BG_COLOR = '#F2F7FF'
const DEFAULT_FONT_COLOR = '#1B2532'
function BaseTable(props) {
  const {
    rowKey,
    columns: cols = [],
    data = [],
    width: w,
    height,
    maxHeight,
    rowHeight = 32,
    headerHeight: hh = 32,
    headerClassName,
    className,
    border = { horizon: true, vertical: true, color: DEFAULT_BORDER_COLOR },
    bodyStyle = {
      fontSize: 12,
      fontWeight: 'normal',
      color: DEFAULT_FONT_COLOR,
      oddRowBgColor: DEFAULT_ODD_ROW_BG_COLOR,
      evenRowBgColor: DEFAULT_EVEN_ROW_BG_COLOR 
    },
    style = {},
    ...rest
  } = props

  const getSorts = (columns) => {
    const _sortState = {}
    const sorts = columns.map(col => {
      const { key, order } = col || {}
      if (order !== 'none') {
        _sortState[key] = order
      }
      return {
        key,
        order,
      }
    })
    return { sorts, sortState: _sortState }
  }

  const columns = handleColumnRenderer(cols)

  const pipeline = useTablePipeline({
    primaryKey: 'id',
  })
    .input({ data, columns })
    .use(groupHeader({ headHeight: hh, cellPadding: 0 }));

  const { sorts, sortState } = getSorts(pipeline.getColumns())
  pipeline.use(sort({ sorts, keepDataSource: true }))
  const pipelineProps = pipeline.getProps()
  const { headerHeight, headerRenderer = DefaultHeaderRenderer } = pipelineProps

  return (
    <div
      className="bdlite-react-base-table-wrapper"
      style={{ 
        '--bdlite-base-table-border-color': border.color,
        '--bdlite-base-table-odd-row-bg-color': bodyStyle.oddRowBgColor,
        '--bdlite-base-table-even-row-bg-color': bodyStyle.evenRowBgColor,
       } as React.CSSProperties}
    >
      <ReactBaseTable
        className={classnames(className, border?.horizon && 'has-horizon-border', border?.vertical && 'has-vertical-border')}
        rowKey={rowKey}
        columns={cols}
        data={data}
        width={w}
        fixed
        height={height}
        maxHeight={maxHeight}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        headerRenderer={headerRenderer}
        headerClassName={classnames(headerHeight?.length > 1 ? 'base-table-group-header' : '', headerClassName)}
        sortState={sortState}
        style={{
          ...style,
          fontSize: bodyStyle.fontSize,
          fontWeight: bodyStyle.fontWeight,
          color: bodyStyle.color 
        }}
        {...pipelineProps}
        {...rest}
      />
    </div>
  );
}

export default BaseTable;
