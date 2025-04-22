import Progress from 'antd/es/progress';
import Tooltip from 'antd/es/tooltip';
import React from 'react';
import Ellipsis from './ellipsis';

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

export const isShowText = (condition = {}) => {
  const { colorStepData, iconData, mode } = condition;
  switch (mode) {
    case 'colorStep': // 色阶
      return colorStepData?.colorSetting?.hideText === 1;
    case 'icon': // 图标
      return iconData?.showType === 'if';
    default:
      return true;
  }
};

export const processColumn = ({ column, ...rest }) => {
  // 如果列已经被处理过，直接返回
  if (column._processed) {
    return column;
  }
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
    let style = { ...getCellStyleFromColumn(column) };
    const { isLink, handleClick, compareOn } = column;
    // 下钻功能
    if (isLink) {
      const onClick = (event) => {
        if (handleClick) {
          handleClick({ cellData, column, event, ...rest });
        }
      };
      content = (
        <a href="#" onClick={onClick}>
          {content}
        </a>
      );
    }
    // 条件格式 色阶
    if (column.backMapping) {
      const backMappingRet = column.backMapping(cellData, rowData);
      if (backMappingRet?.fill) {
        style.backgroundColor = backMappingRet.fill;
        column.style = {
          ...(column?.style || {}),
          backgroundColor: backMappingRet.fill,
        };
      }
    }
    // 文本/背景
    if (column.textMapping) {
      const textMappingret = column.textMapping(cellData, rowData);
      if (textMappingret?.fill) {
        style.color = textMappingret.fill;
      }
    }
    // 文字显示隐藏
    if (column.condition) {
      content = isShowText(column.condition) ? content : null;
    }
    // 图标集
    if (column.iconMapping) {
      const iconMappingret = column.iconMapping(cellData, rowData);
      if (iconMappingret?.icon) {
        content = (
          <span
            style={{ display: 'flex', alignItems: 'center', flex: 1, ...style }}
          >
            <img
              style={{ width: '14px', marginRight: '2px' }}
              src={customSvgIconsMap[iconMappingret.icon]}
            />
            {content}
          </span>
        );
      }
    }
    // 数据条
    if (column.numberMapping) {
      const numberMappingret = column.numberMapping(getFieldMapValue(cellData));
      if (numberMappingret?.percent) {
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
            content = ret
              .filter((c) => c !== null)
              .map((val, i) => {
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
            style.width = '100%';
          }
        }
      }
    }
    if (column.ellipsis) {
      return (
        <Ellipsis
          ellipsis={column.ellipsis ? { tooltip: cellData } : false}
          style={{ ...style }}
        >
          {content}
        </Ellipsis>
      );
    }
    return <span style={{ ...style }}>{content}</span>;
  };

  column.headerRenderer = ({ column, ...rest }) => {
    let content =
      typeof originalHeaderRenderer === 'function'
        ? originalHeaderRenderer({ column, ...rest })
        : column.title;

    // 字段显示内容
    const { showDesc, editorDesc } = column;
    let tooltip = column.title;
    let showEllipsis = !!column.ellipsis;
    if (showDesc && editorDesc) {
      tooltip = editorDesc;
      return (
        <Tooltip title={tooltip}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              borderBottomWidth: '1px',
              borderBottomStyle: 'dashed',
              height: '20px',
              lineHeight: '20px',
            }}
          >
            {content}
          </span>
        </Tooltip>
      );
    }
    return (
      <Ellipsis
        ellipsis={showEllipsis ? { tooltip } : false}
        // style={{ ...getHeaderStyleFromColumn(column) }}
      >
        {content}
      </Ellipsis>
    );
  };

  // 标记列已处理
  column._processed = true;
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

export const getCellStyleFromColumn = (column) => {
  if (!column) return {};

  const style = {};

  if (column.align) {
    style.textAlign = column.align;
    if (column.align === 'right') {
      style.justifyContent = 'flex-end';
    } else if (column.align === 'center') {
      style.justifyContent = 'center';
    } else {
      style.justifyContent = 'flex-start';
    }
  }
  return style;
};
