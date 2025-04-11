import Ellipsis from './ellipsis';
import React from 'react';
import Progress from 'antd/es/progress';

export const getFieldMapValue = (value) => {
  return value?.d || value?.v || value || '-';
};

export const isPositiveOrNegative = (value) => {
  if (typeof value !== 'string' || !value.endsWith('%')) {
    return 'invalid';
  }
  const numericValue = parseFloat(value.replace('%', ''));
  if (isNaN(numericValue)) {
    return 'invalid';
  }
  return numericValue >= 0 ? 'positive' : 'negative';
};

export const getColor = (cellData, colorMode) => {
  let color;
  const isPositive =
    isPositiveOrNegative(getFieldMapValue(cellData)) === 'positive';
  const isNegative =
    isPositiveOrNegative(getFieldMapValue(cellData)) === 'negative';

  if (colorMode === 'red') {
    color = isPositive ? '#FF4D4F' : isNegative ? '#29A294' : undefined;
  } else {
    color = isPositive ? '#29A294' : isNegative ? '#FF4D4F' : undefined;
  }
  return color;
};

export const processColumn = ({ column, ...rest }) => {
  if (column?.children?.length) {
    column.children = column.children.map((column) =>
      processColumn({ column, ...rest }),
    );
  }

  const originalCellRenderer = column.cellRenderer;
  const originalHeaderRenderer = column.headerRenderer;
  const { customSvgIcons } = rest;
  let customSvgIconsMap;
  if (customSvgIcons) {
    customSvgIconsMap = customSvgIcons?.reduce((acc, icon) => {
      acc[icon.name] = icon.svg;
      return acc;
    }, {});
  }

  column.cellRenderer = ({ cellData, column, rowData, ...rest }) => {
    let content = originalCellRenderer
      ? originalCellRenderer({ cellData, column, rowData, ...rest })
      : cellData;
    let style = {};
    const { isLink, handleClick, compareOn } = column;
    // 下钻功能
    if (isLink) {
      const onClick = (event) => {
        if (handleClick) {
          handleClick({ cellData, column, event, ...rest });
        }
      };
      content = (
        <a href="#!" onClick={onClick}>
          {content}
        </a>
      );
    }
    // 条件格式
    if (column.backMapping) {
      const backMappingRet = column.backMapping(cellData, rowData);
      style.backgroundColor = backMappingRet.fill;
      column.style = {
        ...(column?.style || {}),
        backgroundColor: backMappingRet.fill,
      };
    }
    if (column.textMapping) {
      const textMappingret = column.textMapping(cellData, rowData);
      style.color = textMappingret.fill;
    }
    if (column.iconMapping) {
      const iconMappingret = column.iconMapping(cellData, rowData);
      content = (
        <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <img
            style={{ width: '14px', marginRight: '2px' }}
            src={customSvgIconsMap[iconMappingret.icon]}
          />
          {content}
        </span>
      );
    }
    if (column.numberMapping) {
      const numberMappingret = column.numberMapping(getFieldMapValue(cellData));
      content = (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
          }}
        >
          <Progress
            style={{ width: '50%' }}
            size="small"
            showInfo={false}
            percent={numberMappingret.percent}
            strokeColor={numberMappingret.color}
            trailColor={numberMappingret.lineColor}
          />
          {content}
        </span>
      );
    }

    // 同环比功能
    if (compareOn) {
      const { position, compareOpt } = compareOn;

      // right
      if (position === 'right') {
        // 非对比指标字段
        if (!column.isMetricField) {
          style.color = getColor(cellData, compareOn.style);
        }
      }

      // bottom
      if (position === 'bottom') {
        // 对比指标字段
        if (column.isMetricField) {
          if (compareOpt.length) {
            let ret = [content];
            compareOpt.forEach((j) => {
              ret.push(rowData[`${column.key}##${j}`].v);
            });
            content = ret.map((val, i) => {
              return (
                <span
                  key={i}
                  style={{ color: getColor(val, compareOn.style), flex: 1 }}
                >
                  {getFieldMapValue(val)}
                </span>
              );
            });
            style.display = 'flex';
          }
        }
      }
    }
    return (
      <Ellipsis
        ellipsis={column.ellipsis ? { tooltip: cellData } : false}
        style={{ ...style }}
      >
        {content}
      </Ellipsis>
    );
  };

  column.headerRenderer = ({ column, ...rest }) => {
    const content = originalHeaderRenderer
      ? originalHeaderRenderer({ column, ...rest })
      : column.title;
    return (
      <Ellipsis
        ellipsis={column.ellipsis ? { tooltip: column.title } : false}
        // style={{ ...getHeaderStyleFromColumn(column) }}
      >
        {content}
      </Ellipsis>
    );
  };
  return column;
};

export function handleColumnRenderer({ columns, ...rest }) {
  if (!columns?.length) return [];
  return columns.map((column) => processColumn({ column, ...rest }));
}

export function extraCellProps({ column, rowData }) {
  const cellProps = {};
  if (column.backMapping) {
    const backMappingRet = column.backMapping(rowData[column.key], rowData);
    if (backMappingRet) {
      cellProps.style = {
        backgroundColor: backMappingRet.fill,
      };
    }
  }
  return cellProps;
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
