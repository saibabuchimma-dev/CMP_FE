'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string | number;
  label: string;
  subLabel?: string;
  trend?: { value: number; label: string; positive?: boolean };
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ value, label, subLabel, trend, icon, className }: StatCardProps) {
  return (
    <div className={cn('bg-surface p-5 rounded-xl border border-border', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-heading-xl font-heading font-semibold text-text tracking-tight">{value}</div>
          <div className="mt-1 text-body-sm text-text-secondary">{label}</div>
          {subLabel && <div className="mt-0.5 text-body-xs text-text-muted">{subLabel}</div>}
          {trend && (
            <div className="mt-2 flex items-center gap-1.5 text-body-xs font-medium" style={{ color: trend.positive ? '#3F7352' : '#A74732' }}>
              <span>{trend.positive ? '▲' : '▼'} {Math.abs(trend.value)}%</span>
              <span className="text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && <div className="shrink-0 text-text-muted/50">{icon}</div>}
      </div>
    </div>
  );
}