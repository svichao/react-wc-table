import Ellipsis from './ellipsis';

export const processColumn = (column) => {
  if (column?.children?.length) {
    column.children = column.children.map(processColumn);
  }

  const originalCellRenderer = column.cellRenderer;
  const originalHeaderRenderer = column.headerRenderer;

  column.cellRenderer = ({ cellData, column, ...rest }) => {
    const content = originalCellRenderer ? originalCellRenderer({ cellData, column, ...rest }) : cellData
    return <Ellipsis ellipsis={column.ellipsis?{tooltip:cellData}: false}>{content}</Ellipsis>
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
