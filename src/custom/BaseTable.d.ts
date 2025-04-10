import { CSSProperties } from 'react';

interface Column {
  fieldId: string;
  columnName?: string;
  title?: string;
  name?: string;
  key?: string;
  id?: string;
  children?: Column[];
  config?: Record<string, any>;
  width?: number;
  isLink?: boolean;
  isMetricField?: boolean;
  compareOn?: Record<string, any>;
  header?: Record<string, any>;
  cellRenderer?: (params: {
    rowIndex: number;
    cellData: any;
    column: Column;
  }) => any;
}

interface Pagination {
  pageSize: number;
  current: number;
  total: number;
  hideOnSinglePage?: boolean;
  onChange?: (pageNum: number, pageSize: number) => void;
}

interface ChartData {
  dataConfig?: Record<string, any>;
  dataResult?: Record<string, any>;
  eventConfig?: Record<string, any>;
}

interface Style {
  theme?: Record<string, any>;
  pagination?: Record<string, any>;
  content?: Record<string, any>;
  colWidth?: Record<string, any>;
  indexColumn?: { show: boolean };
  superTitle?: { show: boolean; group?: any[] };
  header?: Record<string, any>;
}

interface ChartStatus {
  page?: { pageSize: number; pageNum: number };
  drillDownLevel?: number;
}

interface EmitFunction {
  (event: string, payload: Record<string, any>): void;
}

declare class BaseTable {
  constructor(
    columns?: Column[],
    data?: any[],
    pagination?: Pagination,
    rowKey?: string,
    width?: number,
    height?: number,
    showPagination?: boolean,
    container?: HTMLElement,
    border?: Record<string, any>,
    bodyStyle?: CSSProperties,
    style?: CSSProperties,
    minColWidth?: number,
    scrollWidth?: number,
  );

  getProps(): Record<string, any>;
  getStyle(): CSSProperties;
  setStyle(style: CSSProperties): void;
  getBodyStyle(): CSSProperties;
  setBodyStyle(bodyStyle: CSSProperties): void;
  getBorder(): Record<string, any>;
  setBorder(border: Record<string, any>): void;
  getContainer(): HTMLElement | undefined;
  setContainer(container: HTMLElement): void;
  getWidth(): number | undefined;
  setWidth(width: number): void;
  getHeight(): number | undefined;
  setHeight(height: number): void;
  updateTableSize(container?: HTMLElement): void;
  getColumns(): Column[];
  setColumns(columns: Column[]): void;
  getData(): any[];
  setData(data: any[]): void;
  getPagination(): Pagination | false;
  setPagination(pagination: Pagination): void;
  getPaginationShow(): boolean | undefined;
  setPaginationShow(showPagination: boolean): void;
  flattenColumns(columns: Column[]): Column[];
  flattenArrayToString(array: any[]): string[];
  getCellOriginValue(fieldId: string, value: any, dataCell: any): any;
  getColWidth(column: Column, style: Style, columnsLen: number): number;
  frozenColumns(columns: Column[], content: Record<string, any>): Column[];
  updateFromChartData(params: {
    chartData?: ChartData;
    style?: Style;
    chartStatus?: ChartStatus;
    emit?: EmitFunction;
  }): this;
  handleColumns(params: {
    chartData?: ChartData;
    style?: Style;
    chartStatus?: ChartStatus;
    emit?: EmitFunction;
  }): Column[];
  handleIndexColumn(columns: Column[], style: Style): Column[];
  getSortOrder(column: Column): 'asc' | 'desc' | 'none';
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
  compareObjects(
    obj1: Record<string, any>,
    obj2: Record<string, any>,
    path?: string,
  ): string[];
  filterColumns(columns: Column[]): Column[];
  getColumnTitle(column: Column): string;
  getColumnsLength(columns: Column[]): number;
  transDataByCalc(params: {
    data: any[];
    dataConfig: Record<string, any>;
  }): any[];
  calcNumber(Objcur: any, Objpre: any, isPercent: boolean): any;
  getFieldsByCompareOn(
    compareOn: Record<string, any>,
    columns: Column[],
  ): Column[];
  getFieldName(fieldData: Column): string;
}

export default BaseTable;
