import { CSSProperties } from 'react';

interface Column {
  fieldId?: string;
  key?: string;
  id?: string;
  name?: string;
  title?: string;
  columnName?: string;
  editorTitle?: string;
  children?: Column[];
  width?: number;
  resizable?: boolean;
  align?: string;
  order?: string;
  hidden?: boolean;
  isLink?: boolean;
  handleClick?: (params: {
    column: Column;
    cellData: any;
    event: MouseEvent;
  }) => void;
  backMapping?: any;
  textMapping?: any;
  iconMapping?: any;
  numberMapping?: any;
  isMetricField?: boolean;
  compareOn?: any;
  config?: {
    orderDirection?: string;
    hideField?: number;
    textAlign?: string;
    dataType?: { type: string };
  };
  header?: any;
  features?: {
    sortable?: boolean;
  };
  cellRenderer?: (params: {
    cellData: any;
    column: Column;
    rowIndex?: number;
  }) => any;
  [key: string]: any;
}

interface Pagination {
  pageSize?: number;
  current?: number;
  total?: number;
  hideOnSinglePage?: boolean;
  onChange?: (pageNum: number, pageSize: number) => void;
}

interface Border {
  horizon?: boolean;
  vertical?: boolean;
  color?: string;
}

interface BodyStyle {
  fontWeight?: string;
  fontSize?: number;
  color?: string;
  oddRowBgColor?: string;
  evenRowBgColor?: string;
}

interface Style {
  colWidth?: {
    mode?: string;
    config?: Record<string, { auto?: boolean; width?: number }>;
  };
  indexColumn?: {
    show?: boolean;
  };
  [key: string]: any;
}

interface CompareOn {
  show?: boolean;
  position?: string;
  compareOpt?: string[];
  metricField?: string[];
  content?: string;
}

interface ChartData {
  dataConfig?: any;
  dataResult?: any;
  eventConfig?: any;
}

interface StyleData {
  theme?: any;
  pagination?: Pagination;
  content?: any;
}

interface ChartStatus {
  page?: {
    pageSize?: number;
    pageNum?: number;
  };
  drillDownLevel?: number;
}

interface BaseTableConstructorParams {
  columns?: Column[];
  data?: any[];
  pagination?: Pagination;
  rowKey?: string;
  width?: number;
  height?: number;
  showPagination?: boolean;
  container?: HTMLElement;
  border?: Border;
  bodyStyle?: BodyStyle;
  style?: Style;
  minColWidth?: number;
  scrollWidth?: number;
  extraProps?: Record<string, any>;
  onColumnResize?: (column: Column, width: number) => void;
}

declare class BaseTable {
  constructor(params: BaseTableConstructorParams);

  getProps(): Record<string, any>;
  getColumnResizeFn(): (params: { column: Column; width: number }) => void;
  getExtraProps(): Record<string, any>;
  setExtraProps(extraProps: Record<string, any>): void;
  getStyle(): Style;
  setStyle(style: Style): void;
  getBodyStyle(): BodyStyle;
  setBodyStyle(bodyStyle: BodyStyle): void;
  getBorder(): Border;
  setBorder(border: Border): void;
  getContainer(): HTMLElement | undefined;
  setContainer(container: HTMLElement): void;
  getWidth(): number;
  setWidth(width: number): void;
  getHeight(): number;
  setHeight(height: number): void;
  updateTableSize(container?: HTMLElement): void;
  observeContainer(container: HTMLElement): void;
  removeContainerObserver(): void;
  getColumns(): Column[];
  setColumns(columns: Column[]): void;
  getData(): any[];
  setData(data: any[]): void;
  getPagination(): Pagination | false;
  setPagination(pagination: Pagination): void;
  getPaginationShow(): boolean;
  setPaginationShow(showPagination: boolean): void;
  flattenColumns(columns: Column[]): Column[];
  flattenArrayToString(array: any[]): string[];
  getCellOriginValue(fieldId: string, value: any, dataCell: any): any;
  updateColumnsWidth(): void;
  getColWidth(column: Column): number;
  frozenColumns(columns: Column[], content: any): Column[];
  updateFromChartData(params: {
    chartData?: ChartData;
    style?: StyleData;
    chartStatus?: ChartStatus;
    emit?: (event: string, payload: any) => void;
  }): this;
  handleColumns(params: {
    chartData?: ChartData;
    style?: StyleData;
    chartStatus?: ChartStatus;
    emit?: (event: string, payload: any) => void;
  }): Column[];
  handleIndexColumn(columns: Column[], style: Style): Column[];
  getSortOrder(column: Column): string;
  getFormatedValue(column: Column, value: any): any;
  formatColumn(column: Column): Column;
  generateColumnsMap(columns: Column[]): Record<string, Column>;
  generateColumnsByGroup(
    group: any[],
    columnsMap: Record<string, Column>,
  ): Column[];
  getFieldMapValue(value: any): any;
  generateUniqueId(): string;
  getAlign(column: Column): string;
  getFieldAlignType(column: Column): string;
  compareObjects(obj1: any, obj2: any, path?: string): string[];
  filterColumns(columns: Column[]): Column[];
  getColumnTitle(column: Column): string;
  getColumnsLength(columns: Column[]): number;
  transDataByCalc(params: { data: any[]; dataConfig: any }): any[];
  calcNumber(Objcur: any, Objpre: any, isPercent: boolean): any;
  getFieldsByCompareOn(compareOn: CompareOn, columns: Column[]): Column[];
  getFieldName(fieldData: Column): string;
}

export default BaseTable;
