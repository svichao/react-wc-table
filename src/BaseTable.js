import { get, uniqueId, isObject } from "lodash-es";
import { getFormat, getLinkFields } from "./utils/format.js";
// import { getEventIsExist } from "@/views/board/editor/pageScene/Chart/utils.js";

class BaseTable {
  constructor(
    columns = [],
    data = [],
    pagination,
    rowKey = "id",
    width,
    height,
    showPagination,
    container,
    border = {},
    bodyStyle = {},
    style = {},
    minColWidth = 96,
    scrollWidth = 8,
  ) {
    this.columns = columns;
    this.data = data;
    this.pagination = pagination;
    this.rowKey = rowKey;
    this.width = width;
    this.height = height;
    this.paginationHeight = 32;
    this.valueFormatter = null;
    this.showPagination = showPagination;
    this.container = container;
    this.border = border;
    this.bodyStyle = bodyStyle;
    this.style = style;
    this.minColWidth = minColWidth;
    this.scrollWidth = scrollWidth;
    this.optToLabel = {
      yearRing: "年环比",
      quarterRing: "季环比",
      yearSame: "年同比",
      monthRing: "月环比",
      weeksRing: "周环比",
      dayRing: "日环比",
      weekSame: "周同比",
      monthSame: "月同比",
    };
  }

  getProps() {
    return {
      columns: this.getColumns(),
      data: this.getData(),
      pagination: this.getPagination(),
      rowKey: this.rowKey,
      width: this.getWidth(),
      height: this.getHeight(),
      border: this.getBorder(),
      bodyStyle: this.getBodyStyle(),
      style: this.getStyle(),
    };
  }

  getStyle() {
    return this.style || {};
  }

  setStyle(style) {
    this.style = style || {};
  }

  getBodyStyle() {
    return this.bodyStyle || {};
  }

  setBodyStyle(bodyStyle) {
    this.bodyStyle = { ...this.bodyStyle, ...bodyStyle };
  }

  getBorder() {
    return this.border || {};
  }

  setBorder(border) {
    this.border = border || {};
  }

  // 设置和获取宽度
  getContainer() {
    return this.container;
  }

  setContainer(container) {
    this.container = container;
  }

  // 设置和获取宽度
  getWidth() {
    return this.width;
  }

  setWidth(width) {
    this.width = width;
  }

  // 设置和获取高度
  getHeight() {
    return this.height;
  }

  setHeight(height) {
    this.height = height;
  }

  // 根据父级容器的占位宽高动态获取表格的宽度和高度
  updateTableSize(container) {
    const _container = container || this.container;
    if (_container instanceof HTMLElement) {
      this.setContainer(_container);
      const { offsetWidth, offsetHeight } = _container;
      this.setWidth(offsetWidth);
      this.setHeight(offsetHeight - (this.showPagination ? this.paginationHeight : 0)); // 减去分页高度
    }
  }

  // 设置和获取列
  getColumns() {
    return this.columns;
  }

  setColumns(columns) {
    this.columns = columns;
  }

  // 设置和获取数据
  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  // 设置和获取分页信息
  getPagination() {
    if (this.showPagination) {
      return this.pagination;
    }
    return false;
  }

  setPagination(pagination) {
    this.pagination = { ...this.pagination, ...pagination };
  }

  getPaginationShow() {
    return this.showPagination;
  }

  setPaginationShow(showPagination) {
    this.showPagination = showPagination;
    this.updateTableSize(this.container);
  }

  // 展平列的树形结构
  flattenColumns(columns) {
    const result = [];
    const traverse = cols => cols.forEach(col => (col.children?.length ? traverse(col.children) : result.push(col)));
    traverse(columns);
    return result;
  }

  flattenArrayToString(array) {
    const flatten = arr =>
      arr.reduce((acc, item) => {
        if (Array.isArray(item)) {
          return acc.concat(flatten(item));
        }
        return acc.concat(isObject(item) && item.v !== undefined ? item.v : item);
      }, []);
    return flatten(array);
  }

  getCellOriginValue(fieldId, value, dataCell) {
    return dataCell ? dataCell[fieldId] : value;
  }

  getColWidth(column, style, columnsLen) {
    const { mode, config } = style.colWidth;

    if (mode === "auto") {
      return Math.max(this.minColWidth, this.width / columnsLen);
    }

    if (mode === "custom") {
      const columnConfig = config[column.key] || {};
      if (!columnConfig.auto) {
        return columnConfig.width || this.minColWidth;
      }

      const totalFixedWidth = Object.values(config)
        .filter(cfg => !cfg.auto)
        .reduce((sum, cfg) => sum + (cfg.width || 0), 0);

      const autoColumnCount = Object.values(config).filter(cfg => cfg.auto).length;
      const availableWidth = this.width - totalFixedWidth;

      return Math.max(this.minColWidth, availableWidth / autoColumnCount);
    }

    return this.minColWidth;
  }

  frozenColumns(columns, content) {
    const { frozen, frozenColCount = 0, frozenTrailingColCount = 0 } = content || {};

    if (!frozen) {
      return columns.map(column => ({ ...column, frozen: false }));
    }

    const totalColumns = columns.length;

    const applyFrozenToChildren = (column, frozenValue) => {
      if (column.children && column.children.length) {
        column.children = column.children.map(child => applyFrozenToChildren(child, frozenValue));
      }
      return { ...column, frozen: frozenValue };
    };

    return columns.map((column, index) => {
      let frozenValue = false;
      if (index < frozenColCount) {
        frozenValue = "left";
      } else if (index >= totalColumns - frozenTrailingColCount) {
        frozenValue = "right";
      }
      return column.children && column.children.length
        ? applyFrozenToChildren(column, frozenValue)
        : { ...column, frozen: frozenValue };
    });
  }

  // 从图表数据更新表格
  updateFromChartData({ chartData = {}, style = {}, chartStatus = {}, emit }) {
    console.log("chartStatus: ", chartStatus);
    console.log("chartData: ", chartData);
    console.log("style: ", style);
    const { dataConfig = {}, dataResult = {} } = chartData || {};
    const { values, extraResult } = dataResult || {};
    const { theme, pagination = {}, content = {} } = style || {};
    const { page } = chartStatus;
    const { pageSize, pageNum } = page;
    const { compareOn } = dataConfig || {};

    // 列
    if (chartData && style && chartStatus) {
      this.setColumns(this.handleColumns({ chartData, style, chartStatus, emit }));
    }

    let data = values;
    const isCompare = compareOn.show && !!compareOn?.metricField?.length && !!compareOn?.compareOpt?.length;
    // 同环比数据
    if (isCompare) {
      data = this.transDataByCalc({ data, dataConfig });
    }
    console.log("最终data----------------------------: ", data);
    this.setData(data);

    // 表格样式
    if (content && theme) {
      this.setBorder({ horizon: content?.horizon, vertical: content?.vertical, color: theme.basicColors[10] });
      this.setBodyStyle({
        fontWeight: content?.fontWeight || "normal", // 添加默认值
        fontSize: content?.fontSize || 12, // 添加默认值
        color: theme.basicColors[13],
        oddRowBgColor: theme.basicColors[1],
        evenRowBgColor: theme.basicColors[8],
      });
    }

    // 分页
    if (pagination) {
      this.setPagination({
        pageSize,
        current: pageNum,
        total: extraResult?.totalRowSize?.v || 0,
        hideOnSinglePage: pagination.autoHide,
        onChange: (pageNum, pageSize) => {
          if (emit) {
            emit("handleChangeChartStatus", {
              key: "page",
              value: {
                pageNum,
                pageSize,
              },
              dontFetch: false,
            });
          }
        },
      });
    }

    if (page) {
      this.setPaginationShow(get(dataConfig, "page.show"));
    }

    return this;
  }

  handleColumns({ chartData, style, chartStatus, emit }) {
    const { dataConfig = {}, dataResult = {}, eventConfig = {} } = chartData || {};
    const { fields } = dataResult || {};
    const { header, theme, superTitle, content = {} } = style || {};
    const { group = [] } = superTitle || {};
    const { compareOn, levels = [] } = dataConfig || {};
    const { drillDownLevel } = chartStatus;
    const { linkage = [], skip = [] } = eventConfig || {};
    let needLinkFields = levels.length ? linkage.concat(levels.slice(0, levels.length - 1)) : linkage;
    if (skip.length) {
      needLinkFields = needLinkFields.concat(skip);
    }
    const linkFields = getLinkFields(needLinkFields);

    this.valueFormatter = getFormat(dataConfig?.columns);

    // 展开树形结构的列
    let columns = this.flattenColumns(fields.columns);

    // 下钻 辅助字段
    let drillColumns = [];
    let drillParentColumn;
    if (levels.length) {
      drillParentColumn = levels[drillDownLevel];
      drillColumns = drillParentColumn?.extra?.assist || [];
    }

    // 下钻页
    if (chartStatus.drillDownLevel > 0) {
      columns = [drillParentColumn, ...drillColumns];
    } else {
      // 首页 表头分组
      if (style?.superTitle?.show) {
        columns = this.generateColumnsByGroup(group, this.generateColumnsMap(columns));

        if (drillColumns.length) {
          columns = [...columns, ...drillColumns];
        }
      }
    }

    // 同环比
    columns = [...columns, ...this.getFieldsByCompareOn(compareOn, columns)];

    // 序号列
    columns = this.handleIndexColumn(columns, style);

    // 冻结列
    columns = this.frozenColumns(columns, content);

    // 叶子列总数
    const columnsLen = this.getColumnsLength(columns);
    // 处理列宽，添加下钻事件
    const processColumn = column => {
      if (column.children && column.children.length) {
        column.children = column.children.map(processColumn);
        column.header = header;
      } else {
        column.width = this.getColWidth(column, style, columnsLen);
        column.header = {
          ...header,
          color: theme.basicColors[0],
          bgColor: theme.basicColors[3],
        };
        // 添加链接
        column.isLink = linkFields.includes(column.key);

        const { name: originName, key } = column;
        if (column.isLink) {
          column.handleClick = ({ column, cellData, event }) => {
            if (emit) {
              emit("handleChartClick", {
                seriesName: key,
                dimensionName: key,
                triggerField: {
                  fieldId: key,
                  field: key,
                  name: originName,
                  title: this.getFormatedValue(column, cellData),
                  record: cellData,
                  value: cellData.v,
                  dictionaryValue: cellData.d,
                },
                name: originName,
                event: {
                  event: {
                    x: event.clientX,
                    y: event.clientY,
                  },
                },
              });
            }
          };
        }

        // 同环比对比指标字段
        if (compareOn.metricField.includes(key)) {
          column.isMetricField = true;
          column.compareOn = compareOn;
        }

        column = this.formatColumn(column);
      }
      return column;
    };

    columns = columns.map(processColumn);
    console.log("最终columns:------------------ ", columns);
    return columns;
  }

  handleIndexColumn(columns, style) {
    if (style.indexColumn.show) {
      const fieldWidthMap = style.colWidth.config;
      columns.unshift({
        fieldId: "$$series_number$$",
        columnName: "序号列",
        title: "序号列",
        config: fieldWidthMap.$$series_number$$,
        cellRenderer: ({ rowIndex }) => {
          return rowIndex + 1;
        },
      });
    }
    return columns;
  }

  // 获取列的排序方式
  getSortOrder(column) {
    const { orderDirection } = column?.config || {};
    if (orderDirection) {
      if (orderDirection === "ascending") return "asc";
      if (orderDirection === "descending") return "desc";
      if (orderDirection === "custom") return "none";
    }
    return "none";
  }

  getFormatedValue(column, value) {
    const getter = this.valueFormatter.get(column.fieldId);
    if (getter) {
      return getter(value);
    } else {
      return this.getFieldMapValue(value);
    }
  }

  // 格式化列
  formatColumn(column = {}) {
    const order = this.getSortOrder(column);
    const align = this.getFieldAlignType(column);
    const key = column.key || column.id || column.fieldId;
    const ret = {
      ...column,
      title: this.getColumnTitle(column),
      resizable: column.resizable || true,
      key,
      dataKey: key,
      align,
      order,
      features: {
        sortable: !!column.config?.orderDirection,
      },
      hidden: column.config?.hideField === 1,
      ellipsis: false,
    };
    if (!ret.cellRenderer) {
      ret.cellRenderer = ({ cellData, column }) => {
        return this.getFormatedValue(column, cellData);
      };
    }
    return ret;
  }

  // 生成列的映射
  generateColumnsMap(columns = []) {
    return columns.reduce((ret, cur) => {
      ret[cur.fieldId] = cur;
      return ret;
    }, {});
  }

  // 根据分组生成列
  generateColumnsByGroup(group, columnsMap) {
    return group.map(item => {
      if (item.children?.length) {
        item.isGroup = true;
        item.children = this.generateColumnsByGroup(item.children, columnsMap);
      }
      if (columnsMap[item.id]) {
        return this.formatColumn({
          ...item,
          ...columnsMap[item.id],
        });
      }
      return this.formatColumn(item);
    });
  }

  // 获取字段映射值
  getFieldMapValue(value) {
    return value?.d || value?.v || "-";
  }

  // 生成唯一 ID
  generateUniqueId() {
    return uniqueId();
  }

  getAlign(column) {
    const align = get(column, "config.textAlign");
    return align === "textAlignNone" ? "left" : align || "left";
  }

  getFieldAlignType(column) {
    if (column.from === "metric" || get(column, "config.dataType.type") === "datetime") {
      return "right";
    }
    return this.getAlign(column);
  }

  // 比对两个对象的区别
  compareObjects(obj1, obj2, path = "") {
    const differences = [];
    const isObject = value => value && typeof value === "object" && !Array.isArray(value);
    const isArray = Array.isArray;

    const compare = (o1, o2, currentPath) => {
      const keys = new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})]);
      keys.forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        const val1 = o1[key],
          val2 = o2[key];
        if (isObject(val1) && isObject(val2)) {
          compare(val1, val2, newPath);
        } else if (isArray(val1) && isArray(val2)) {
          if (val1.length !== val2.length || !val1.every((item, index) => item === val2[index])) {
            differences.push(newPath);
          }
        } else if (val1 !== val2) {
          differences.push(newPath);
        }
      });
    };

    compare(obj1, obj2, path);
    return differences;
  }

  // 根据 hideField 过滤列
  filterColumns(columns) {
    const filter = cols =>
      cols
        .map(col => {
          if (col.children?.length) {
            col.children = filter(col.children);
            col.isGroup = true;
          }
          return (col.isGroup && !col.children.length) || col.config?.hideField === 1 ? null : col;
        })
        .filter(Boolean); // 去掉为 null 的节点
    return filter(columns);
  }

  getColumnTitle(column) {
    return this.getFieldName(column);
    // return column.editorTitle || column.columnName || column.title || column.name;
  }

  getColumnsLength(columns) {
    const getLeafCount = cols =>
      cols.reduce((count, col) => {
        if (col.children && col.children.length) {
          return count + getLeafCount(col.children);
        }
        return count + 1;
      }, 0);

    return getLeafCount(columns);
  }

  transDataByCalc({ data, dataConfig }) {
    const { compareOn } = dataConfig;

    // 深拷贝数据，移除 Proxy 包装
    let newData = data;

    const { metricField = [], compareOpt = [] } = compareOn;
    // metricField * compareOpt 笛卡尔积
    let transPercentData = [];
    newData.forEach(item => {
      let current = { ...item };
      metricField.forEach(i => {
        compareOpt.forEach(j => {
          current[`${i}##${j}`] = this.calcNumber(item[i], item[`${i}##${j}`], compareOn.content === "percent");
        });
      });

      transPercentData.push(current);
    });
    newData = transPercentData;

    // if (compareOn.position === "bottom") {
    //   // 拼到一个 value 里面
    //   const { metricField = [], compareOpt = [] } = compareOn;
    //   let transList = metricField.map(i => {
    //     return [
    //       i,
    //       ...compareOpt.map(j => {
    //         return `${i}##${j}`;
    //       }),
    //     ];
    //   });

    //   newData.forEach(item => {
    //     transList.forEach(field => {
    //       let values = field.map(i => [item[i]]);
    //       item[field[0]] = {
    //         v: values,
    //       };
    //     });
    //   });
    // }
    return newData;
  }

  calcNumber(Objcur, Objpre, isPercent) {
    let cur = Objcur?.v;
    let pre = Objpre?.v;

    if (pre === null || cur === null) return "-";
    if (isPercent) {
      try {
        if (pre === 0 || pre < 0) return "-";
        let res = ((cur - pre) / pre) * 100;
        // res保留两位小数
        res = Math.round(res * 100) / 100;
        return {
          v: isNaN(res) ? "-" : res + "%",
        };
      } catch (error) {
        return {
          v: "-",
        };
      }
    } else {
      const res = cur - pre;
      return {
        v: Number.isNaN(res) ? "-" : res,
      };
    }
  }
  // 通过compareOn解析出字段
  getFieldsByCompareOn(compareOn, columns) {
    const columnsMap = columns.reduce((acc, cur) => {
      acc[cur.fieldId] = cur;
      return acc;
    }, {});
    const transName = (id, opt) => {
      let name = this.getFieldName(columnsMap[id]);
      this.optToLabel[opt] && (name += `(${this.optToLabel[opt]})`);
      return name;
    };

    const { show, position, compareOpt = [], metricField = [] } = compareOn;
    if (show && position == "right") {
      // metricField 和 compareOpt  笛卡尔积
      let res = [];
      metricField.forEach(item => {
        compareOpt.forEach(opt => {
          if (columnsMap[item]) {
            res.push({
              field: `${item}##${opt}`,
              fieldId: `${item}##${opt}`,
              name: transName(item, opt),
              compareOn, // 同环比标识
            });
          }
        });
      });

      return res;
    }

    return [];
  }
  // 获取字段的名称，editorTitle【编辑器修改的标题】 > title【数据集修改的标题】 > columnName
  getFieldName(fieldData = {}) {
    if (!fieldData) return "";
    return fieldData.editorTitle || fieldData.title || fieldData.columnName || fieldData.name;
  }

  // // 下钻和联动的选择时的事件
  // handleClickMenu({ chartStatus, type }) {
  //   chartStatus.value.type = type;
  //   const { dimensionName, triggerField, clickEvent } = optData.value;
  //   if (type == LEVELS_TYPE) {
  //     drillDown(dimensionName, { triggerField });
  //   } else if (type == LINK_TYPE) {
  //     updateConnectChart(dimensionName, { triggerField });
  //   } else if (type == SKIP_TYPE) {
  //     // goToURL(dimensionName, triggerItem, { trig gerField });
  //     goToURL(triggerField, clickEvent);
  //   }
  //   optData.value = {};
  // }
}

export default BaseTable;
