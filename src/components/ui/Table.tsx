'use client';

import { Table as MantineTable, TableProps, TableTd, TableTh, TableTr } from '@mantine/core';
import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> extends Omit<TableProps, 'children' | 'data'> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  rowClassName?: string | ((row: T, index: number) => string);
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loading?: boolean;
  loadingRows?: number;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  rowClassName,
  onRowClick,
  emptyMessage = 'No data available',
  emptyIcon,
  loading = false,
  loadingRows = 5,
  className,
  ...props
}: DataTableProps<T>) {
  const isClickable = typeof onRowClick === 'function';

  if (loading) {
    return (
      <div className={cn('overflow-hidden border border-border rounded-2xl bg-surface shadow-xs', className)}>
        {Array.from({ length: loadingRows }).map((_, i) => (
          <div key={i} className="grid gap-4 px-6 py-4 animate-pulse" style={{ gridTemplateColumns: columns.map(c => c.width || '1fr').join(' ') }}>
            {columns.map((col) => (
              <div key={col.key} className="skeleton h-4 w-3/4" style={{ width: col.width }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('overflow-hidden border border-border rounded-2xl bg-surface shadow-xs', className)}>
        <div className="empty-state p-14 sm:p-16">
          {emptyIcon && <div className="empty-state-icon text-4xl mb-3">{emptyIcon}</div>}
          <div className="empty-state-title text-body-md font-medium text-text">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden border border-border rounded-2xl bg-surface shadow-xs', className)}>
      <MantineTable {...props}>
        <thead>
          <tr className="bg-background/80 border-b border-border">
            {columns.map((column) => (
              <TableTh
                key={column.key}
                className={cn('px-6 py-4 text-left text-body-xs font-semibold text-text-muted uppercase tracking-wider', column.headerClassName)}
                style={{ width: column.width }}
              >
                {column.header}
              </TableTh>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <TableTr
              key={keyExtractor(row, rowIndex)}
              className={cn(
                'transition-colors hover:bg-background/70',
                typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName,
                isClickable && 'cursor-pointer'
              )}
              onClick={isClickable ? () => onRowClick(row, rowIndex) : undefined}
            >
              {columns.map((column) => (
                <TableTd
                  key={column.key}
                  className={cn('px-6 py-4.5 text-body-sm border-b border-border-light last:border-0', column.className)}
                  style={{ width: column.width }}
                >
                  {column.render ? column.render(row, rowIndex) : (row as any)[column.key]}
                </TableTd>
              ))}
            </TableTr>
          ))}
        </tbody>
      </MantineTable>
    </div>
  );
}

export function SimpleTable({ children, className, ...props }: TableProps & { className?: string }) {
  return (
    <div className={cn('overflow-hidden border border-border rounded-2xl bg-surface shadow-xs', className)}>
      <MantineTable {...props}>
        {children}
      </MantineTable>
    </div>
  );
}

export { TableTh, TableTd, TableTr };