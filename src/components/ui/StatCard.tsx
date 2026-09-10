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
    <div className={cn('bg-surface p-6 rounded-2xl border border-border shadow-xs hover:shadow-md transition-all', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-3xl sm:text-4xl font-heading font-bold text-text tracking-tight">{value}</div>
          <div className="mt-1.5 text-body-sm font-medium text-text-secondary">{label}</div>
          {subLabel && <div className="mt-0.5 text-body-xs text-text-muted">{subLabel}</div>}
          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5 text-body-xs font-medium" style={{ color: trend.positive ? '#2E6930' : '#AE4E22' }}>
              <span>{trend.positive ? '▲' : '▼'} {Math.abs(trend.value)}%</span>
              <span className="text-text-muted">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="shrink-0 h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}