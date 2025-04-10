import { CSSProperties, ReactNode } from 'react';

export interface Column {
  key?: string;
  title?: string;
  children?: Column[];
  cellRenderer?: (props: CellRendererProps) => ReactNode;
  headerRenderer?: (props: HeaderRendererProps) => ReactNode;
  isLink?: boolean;
  handleClick?: (params: HandleClickParams) => void;
  compareOn?: CompareOn;
  backMapping?: (cellData: any, rowData: any) => MappingResult;
  textMapping?: (cellData: any, rowData: any) => MappingResult;
  iconMapping?: (cellData: any, rowData: any) => MappingResult;
  numberMapping?: (cellData: any) => MappingResult;
  style?: CSSProperties;
  ellipsis?: boolean;
  isMetricField?: boolean;
}

export interface CellRendererProps {
  cellData: any;
  column: Column;
  rowData: any;
  [key: string]: any;
}

export interface HeaderRendererProps {
  column: Column;
  [key: string]: any;
}

export interface HandleClickParams {
  cellData: any;
  column: Column;
  event: React.MouseEvent<HTMLAnchorElement>;
  [key: string]: any;
}

export interface CompareOn {
  position: 'right' | 'bottom';
  style: 'red' | 'green';
  compareOpt?: string[];
}

export interface MappingResult {
  fill: string;
}

export function getFieldMapValue(value: any): string;

export function isPositiveOrNegative(
  value: string,
): 'positive' | 'negative' | 'invalid';

export function getColor(
  cellData: any,
  colorMode: 'red' | 'green',
): string | undefined;

export function processColumn(column: Column): Column;

export function processCellProps(column: Column): Column;

export function handleColumnRenderer(columns: Column[]): Column[];

export function extraCellProps(params: { column: Column; rowData: any }): {
  style?: CSSProperties;
};

export function getHeaderStyleFromColumn(column: Column): CSSProperties;
