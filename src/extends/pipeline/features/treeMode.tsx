import cx from 'classnames';
import React from 'react';

import { ArtColumn } from '../interfaces';
import { ExpansionCell, icons, InlineFlexCell } from '../utils/common-view';
import { TablePipeline } from '../pipeline';
import { isLeafNode as standardIsLeafNode, safeRender } from '../utils/utils';

export const treeMetaSymbol = Symbol('treeMetaSymbol');

export interface TreeModeFeatureOptions {
  /** 非受控用法：默认展开的 keys */
  defaultOpenKeys?: string[];

  /** 受控用法：当前展开的 keys */
  openKeys?: string[];

  /** 受控用法：展开 keys 改变的回调 */
  onChangeOpenKeys?(
    nextKeys: string[],
    key: string,
    action: 'expand' | 'collapse',
  ): void;

  /** 自定义叶子节点的判定逻辑 */
  isLeafNode?(
    node: any,
    nodeMeta: { depth: number; expanded: boolean; rowKey: string },
  ): boolean;

  /** icon 的缩进值。一般为负数，此时 icon 将向左偏移，默认从 pipeline.ctx.indents 中获取 */
  iconIndent?: number;

  /** icon 与右侧文本的距离，默认从 pipeline.ctx.indents 中获取 */
  iconGap?: number;

  /** 每一级缩进产生的距离，默认从 pipeline.ctx.indents 中获取 */
  indentSize?: number;

  /** 点击事件的响应区域 */
  clickArea?: 'cell' | 'content' | 'icon';

  /** 是否对触发展开/收拢的 click 事件调用 event.stopPropagation() */
  stopClickEventPropagation?: boolean;

  /** 指定表格每一行元信息的记录字段 */
  treeMetaKey?: string | symbol;
}

export function treeMode(opts: TreeModeFeatureOptions = {}) {
  return function treeModeStep(pipeline: TablePipeline) {
    const stateKey = 'treeMode';
    const ctx = pipeline.ctx;

    const primaryKey = pipeline.ensurePrimaryKey('treeMode') as string;
    if (typeof primaryKey !== 'string') {
      throw new Error('treeMode 仅支持字符串作为 primaryKey');
    }

    const openKeys: string[] =
      opts.openKeys ??
      pipeline.getStateAtKey(stateKey) ??
      opts.defaultOpenKeys ??
      [];
    const openKeySet = new Set(openKeys);
    const onChangeOpenKeys: TreeModeFeatureOptions['onChangeOpenKeys'] = (
      nextKeys: string[],
      key,
      action,
    ) => {
      opts.onChangeOpenKeys?.(nextKeys, key, action);
      pipeline.setStateAtKey(stateKey, nextKeys, { key, action });
    };

    const toggle = (rowKey: string) => {
      const expanded = openKeySet.has(rowKey);
      if (expanded) {
        onChangeOpenKeys(
          openKeys.filter((key) => key !== rowKey),
          rowKey,
          'collapse',
        );
      } else {
        onChangeOpenKeys([...openKeys, rowKey], rowKey, 'expand');
      }
    };
    const isLeafNode = opts.isLeafNode ?? standardIsLeafNode;
    const clickArea = opts.clickArea ?? 'cell';
    const treeMetaKey = opts.treeMetaKey ?? treeMetaSymbol;
    const stopClickEventPropagation = Boolean(opts.stopClickEventPropagation);

    // indents
    const iconWidth = ctx.indents.iconWidth;
    const iconIndent = opts.iconIndent ?? ctx.indents.iconIndent;
    const iconGap = opts.iconGap ?? ctx.indents.iconGap;
    const indentSize = opts.indentSize ?? ctx.indents.indentSize;
    const columnsData = pipeline.getColumns();
    const firstShowCol = columnsData.find((t) => !t?.hidden);

    pipeline.appendTableProps('cellProps', (args) => {
      const { rowData, column } = args;
      if (column.key === firstShowCol.key) {
        if (rowData[treeMetaKey] == null) {
          // 没有 treeMeta 信息的话，就返回原先的 cellProps
          return null;
        }
        const { isLeaf, rowKey } = rowData[treeMetaKey];
        if (isLeaf) {
          return null;
        }
        return {
          onClick(e: any) {
            if (stopClickEventPropagation) {
              e.stopPropagation();
            }
            toggle(rowKey);
          },
          style: { cursor: 'pointer' },
        };
      }
      return null;
    });

    return pipeline.mapDataSource(processDataSource).mapColumns(processColumns);

    function processDataSource(input: any[]) {
      const result: any[] = [];
      dfs(input, 0);

      function dfs(nodes: any[], depth: number) {
        if (nodes == null) {
          return;
        }
        for (const node of nodes) {
          const rowKey = node[primaryKey];
          const expanded = openKeySet.has(rowKey);

          const isLeaf = isLeafNode(node, { depth, expanded, rowKey });
          const treeMeta = { depth, isLeaf, expanded, rowKey };
          result.push({ [treeMetaKey]: treeMeta, ...node });

          if (!isLeaf && expanded) {
            dfs(node.children, depth + 1);
          }
        }
      }
      return result;
    }

    function processColumns(columns: ArtColumn[]) {
      if (columns.length === 0) {
        return columns;
      }
      const [firstCol, ...others] = columns;

      const columsClone = [...columns];
      const _firstShowCol = columsClone.find((t) => !t?.hidden) || firstCol;

      const cellRenderer = (args: {
        cellData: any;
        columns: ArtColumn[];
        column: ArtColumn;
        columnIndex: number;
        rowData: any;
        rowIndex: number;
        container: any;
        isScrolling?: boolean;
      }) => {
        const { rowData: record } = args;
        const content = safeRender(_firstShowCol, args);
        if (record[treeMetaKey] == null) {
          // 没有 treeMeta 信息的话，就返回原先的渲染结果
          return content;
        }

        const { rowKey, depth, isLeaf, expanded } = record[treeMetaKey];

        const indent = iconIndent + depth * indentSize;

        if (isLeaf) {
          return (
            <InlineFlexCell className="expansion-cell leaf">
              <div
                style={{ width: indent + iconWidth + iconGap, height: 0 }}
              ></div>
              <span>{content}</span>
            </InlineFlexCell>
          );
        }

        const onClick = (e: React.MouseEvent) => {
          if (stopClickEventPropagation) {
            e.stopPropagation();
          }
          toggle(rowKey);
        };

        const expandCls = expanded ? 'expanded' : 'collapsed';

        return (
          <ExpansionCell
            className={cx('expansion-cell', expandCls)}
            style={{
              cursor: clickArea === 'content' ? 'pointer' : undefined,
            }}
            onClick={clickArea === 'content' ? onClick : undefined}
          >
            <div style={{ width: indent, height: 0 }}></div>
            <icons.CaretRight
              className={cx('expansion-icon', expandCls)}
              style={{
                cursor: clickArea === 'icon' ? 'pointer' : undefined,
                // marginLeft: indent,
                marginRight: iconGap,
              }}
              onClick={clickArea === 'icon' ? onClick : undefined}
            />
            {content}
          </ExpansionCell>
        );
      };

      const firstShowColIndex = columsClone.findIndex((t) => !t?.hidden);
      if (firstShowColIndex > -1) {
        const colExpand = columsClone[firstShowColIndex];
        columsClone[firstShowColIndex] = {
          ...colExpand,
          name: (
            <span style={{ marginLeft: iconIndent + iconWidth + iconGap }}>
              {colExpand.name}
            </span>
          ),
          cellRenderer: cellRenderer,
        };
        return [...columsClone];
      }

      return [
        {
          ...firstCol,
          name: (
            <span style={{ marginLeft: iconIndent + iconWidth + iconGap }}>
              {firstCol.name}
            </span>
          ),
          cellRenderer: cellRenderer,
          // getCellProps: clickArea === 'cell' ? getCellProps : firstCol.getCellProps,
        },
        ...others,
      ];
    }
  };
}
