import Ellipsis from './ellipsis';

export const getFieldMapValue = (value) => {
  return value?.d || value?.v || value || "-";
}

export const isPositiveOrNegative = (value) => {
  if (typeof value !== 'string' || !value.endsWith('%')) {
    return 'invalid';
  }
  const numericValue = parseFloat(value.replace('%', ''));
  if (isNaN(numericValue)) {
    return 'invalid';
  }
  return numericValue >= 0 ? 'positive': 'negative';
}

export const getColor = (cellData, colorMode) => {
  let color
  const isPositive = isPositiveOrNegative(getFieldMapValue(cellData)) === 'positive';
  const isNegative = isPositiveOrNegative(getFieldMapValue(cellData)) === 'negative';

  if (colorMode === 'red') {
    color = isPositive ? "#FF4D4F" : isNegative ? "#29A294" : undefined;
  } else {
    color = isPositive ? "#29A294" : isNegative ? "#FF4D4F" : undefined;
  }
  return color
}

export const processColumn = (column) => {
  if (column?.children?.length) {
    column.children = column.children.map(processColumn);
  }

  const originalCellRenderer = column.cellRenderer;
  const originalHeaderRenderer = column.headerRenderer;

  column.cellRenderer = ({ cellData, column, rowData, ...rest }) => {
    let content = originalCellRenderer ? originalCellRenderer({ cellData, column, rowData, ...rest }) : cellData
    let style = {}
    const {handleDrill, compareOn} = column
    // 下钻功能
    if (handleDrill) {
      content = <a  href="#!" onClick={(event) => column.handleDrill({ cellData, column, event, ...rest })}>{content}</a>
    }

    // 同环比功能
    if (compareOn) {
      const {position, compareOpt} = compareOn

      // right
      if (position === 'right') {
        // 非对比指标字段
        if (!column.isMetricField) {
          style.color = getColor(cellData, compareOn.style)
        }
      }
  
      // bottom
      if (position === 'bottom') {
        // 对比指标字段
        if (column.isMetricField) {
          if (compareOpt.length) {
            let ret = [content]
            compareOpt.forEach(j => {
              ret.push(rowData[`${column.key}##${j}`].v)
            })
            content = ret.map(val => {
              return <span style={{color: getColor(val, compareOn.style), flex: 1}}>{val} </span>
            })
            style.display = 'flex'
          }
        }
      }
    }
    return <Ellipsis ellipsis={column.ellipsis?{tooltip:cellData}: false} style={{...style}}>{content}</Ellipsis>
  }

  column.headerRenderer = ({ column, ...rest }) => {
    const content = originalHeaderRenderer ? originalHeaderRenderer({ column, ...rest }) : column.title
    return <Ellipsis ellipsis={column.ellipsis?{tooltip: column.title}:false} style={{...getHeaderStyleFromColumn(column)}}>{content}</Ellipsis>
  }
  return column
};

export function handleColumnRenderer(columns) {
  return columns.map(processColumn);
}


export const getHeaderStyleFromColumn = (column) => {
  const { header } = column;
  if (!header) return {};

  const style = {};

  if (header.align) {
    style.textAlign = header.align;
    if (header.align === 'right') {
      style.justifyContent = 'flex-end';
    } else if (header.align === 'center') {
      style.justifyContent = 'center';
    } else {
      style.justifyContent = 'flex-start';
    }
  }

  if (header.fontFamily) {
    style.fontFamily = header.fontFamily;
  }

  if (header.fontSize) {
    style.fontSize = `${header.fontSize}px`;
  }

  if (header.fontWeight) {
    style.fontWeight = header.fontWeight;
  }

  // if (header.height) {
  //   style.height = `${header.height}px`;
  // }

  if (header.color) {
    style.color = header.color;
  }

  if (header.bgColor) {
    style.backgroundColor = header.bgColor;
  }

  if (!header.show) {
    style.display = 'none';
  }

  return style;
};
