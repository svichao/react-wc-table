// import ReactBaseTable, { SortOrder } from 'react-base-table'
import ReactBaseTable from 'react-base-table'
import { groupHeader, sort } from './features'
import { useTablePipeline } from './pipeline';
import DefaultHeaderRenderer from './features/default-header-renderer';
import classnames from 'classnames'
import { handleColumnRenderer } from './features/config';
import 'react-base-table/styles.css'
import './style.scss'

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
  console.log('columns: ', columns);

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
    <div className="bdlite-react-base-table-wrapper">
      <ReactBaseTable
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
        {...pipelineProps}
        {...rest}
      />
    </div>
  );
}

export default BaseTable;
