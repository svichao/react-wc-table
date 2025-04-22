import classnames from 'classnames';
import React from 'react';
import Table from '../../base';
import { useTablePipeline } from '../pipeline';
import { defaultHeaderRenderer, groupHeader, sort } from '../pipeline/features';
import {
  extraCellProps,
  handleColumnRenderer,
} from '../pipeline/features/config';
import './style.less';

const DEFAULT_BORDER_COLOR = '#D8E0E8';
const DEFAULT_ODD_ROW_BG_COLOR = '#FFF';
const DEFAULT_EVEN_ROW_BG_COLOR = '#F2F7FF';
const DEFAULT_FONT_COLOR = '#1B2532';
function BaseTable(props: any) {
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
      evenRowBgColor: DEFAULT_EVEN_ROW_BG_COLOR,
    },
    style = {},
    cellProps = {},
    extraProps = {},
    onColumnSort,
    ...rest
  } = props;

  const getSorts = (columns: any[]) => {
    const _sortState: any = {};
    const sorts = columns.map((col) => {
      const { key, order } = col || {};
      if (order !== 'none') {
        _sortState[key] = order;
      }
      return {
        key,
        order,
      };
    });
    return { sorts, sortState: _sortState };
  };

  const columns = handleColumnRenderer({
    columns: cols,
    customSvgIcons: extraProps?.customSvgIcons || undefined,
  } as any);

  const pipeline = useTablePipeline({
    primaryKey: 'id',
  })
    .input({ data, columns } as any, { rowHeight, headerHeight: hh } as any)
    .use(groupHeader({ headHeight: hh, cellPadding: 0 }));

  const { sorts, sortState } = getSorts(pipeline.getColumns());
  pipeline.use(
    sort({ sorts, keepDataSource: true, onChangeSorts: onColumnSort }),
  );
  const pipelineProps = pipeline.getProps();
  const { headerHeight, headerRenderer = defaultHeaderRenderer } =
    pipelineProps;

  const handleCellProps = (args: any) => {
    if (typeof cellProps === 'function') {
      return {
        ...extraCellProps(args),
        ...cellProps(args),
      };
    }
    return {
      ...extraCellProps(args),
      ...cellProps,
    };
  };

  return (
    <div
      className="bdlite-react-base-table-wrapper"
      style={
        {
          '--bdlite-base-table-border-color': border.color,
          '--bdlite-base-table-odd-row-bg-color': bodyStyle.oddRowBgColor,
          '--bdlite-base-table-even-row-bg-color': bodyStyle.evenRowBgColor,
        } as React.CSSProperties
      }
    >
      <Table
        className={classnames(
          className,
          border?.horizon && 'has-horizon-border',
          border?.vertical && 'has-vertical-border',
        )}
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
        headerClassName={classnames(
          headerHeight?.length > 1 ? 'base-table-group-header' : '',
          headerClassName,
        )}
        sortState={sortState}
        cellProps={handleCellProps}
        style={{
          ...style,
          fontSize: bodyStyle.fontSize,
          fontWeight: bodyStyle.fontWeight,
          color: bodyStyle.color,
        }}
        {...pipelineProps}
        {...rest}
      />
    </div>
  );
}

export default BaseTable;
