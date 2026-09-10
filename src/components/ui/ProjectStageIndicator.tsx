'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PROJECT_STAGES, STAGE_COLORS } from '@/constants';

interface ProjectStageIndicatorProps {
  stage: (typeof PROJECT_STAGES)[number];
  percentComplete?: number;
  vertical?: boolean;
  height?: number;
  showLabels?: boolean;
  className?: string;
}

export function ProjectStageIndicator({ stage, percentComplete = 0, vertical = false, height = 96, showLabels = false, className }: ProjectStageIndicatorProps) {
  const stageIndex = PROJECT_STAGES.indexOf(stage);
  const filledBands = stageIndex + 1;
  const bandColors = PROJECT_STAGES.map(s => STAGE_COLORS[s]);

  if (vertical) {
    return (
      <div className={cn('flex flex-col-reverse gap-[3px]', className)} style={{ width: 7, height }}>
        {PROJECT_STAGES.map((s, i) => {
          const active = i < filledBands;
          const isCurrent = s === stage;
          const label = showLabels ? (
            <span className="absolute left-full ml-2 whitespace-nowrap text-body-xs text-text-muted" style={{ top: '50%', transform: 'translateY(-50%)' }}>
              {s}
            </span>
          ) : null;
          return (
            <div key={s} className="relative flex-1" style={{ background: active ? bandColors[i] : 'var(--color-border-light)', opacity: active ? (isCurrent ? 1 : 0.72) : 1 }}>
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-[2px]', className)} style={{ height: 6 }}>
      {PROJECT_STAGES.map((s, i) => (
        <div
          key={s}
          className={cn('flex-1 transition-all duration-300', showLabels && 'group')}
          style={{
            background: i < filledBands ? bandColors[i] : 'var(--color-border-light)',
            opacity: i < filledBands ? (s === stage ? 1 : 0.72) : 1,
          }}
        >
          {showLabels && (
            <span className="absolute -top-6 left-0 text-body-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {s}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProjectStageCompact({ stage, percentComplete, className }: { stage: (typeof PROJECT_STAGES)[number]; percentComplete: number; className?: string }) {
  const color = STAGE_COLORS[stage];
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-body-sm font-medium text-text">{stage}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-24 h-1.5 rounded-full bg-border-light overflow-hidden" role="progressbar" aria-valuenow={percentComplete} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentComplete}%`, backgroundColor: color }} />
        </div>
        <span className="text-body-xs font-mono text-text-muted w-10 text-right">{percentComplete}%</span>
      </div>
    </div>
  );
}