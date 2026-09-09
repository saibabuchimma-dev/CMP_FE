'use client';

import { Badge, BadgeProps } from '@mantine/core';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DOCUMENT_STATUS_CONFIG, RFI_STATUS_CONFIG, SUBMITTAL_STATUS_CONFIG, ISSUE_STATUS_CONFIG, ISSUE_PRIORITY_COLORS } from '@/constants';

interface StatusBadgeProps extends Omit<BadgeProps, 'color' | 'variant'> {
  status: string;
  type?: 'document' | 'rfi' | 'submittal' | 'issue' | 'priority';
}

export function StatusBadge({ status, type = 'document', className, children, ...props }: StatusBadgeProps) {
  let config: { color: string; bg: string; label?: string } | undefined;
  let label = children ?? status;

  switch (type) {
    case 'document':
      config = DOCUMENT_STATUS_CONFIG[status as keyof typeof DOCUMENT_STATUS_CONFIG];
      if (config?.label) label = config.label;
      break;
    case 'rfi':
      config = RFI_STATUS_CONFIG[status as keyof typeof RFI_STATUS_CONFIG];
      break;
    case 'submittal':
      config = SUBMITTAL_STATUS_CONFIG[status as keyof typeof SUBMITTAL_STATUS_CONFIG];
      break;
    case 'issue':
      config = ISSUE_STATUS_CONFIG[status as keyof typeof ISSUE_STATUS_CONFIG];
      break;
    case 'priority':
      const priorityColor = ISSUE_PRIORITY_COLORS[status as keyof typeof ISSUE_PRIORITY_COLORS];
      if (priorityColor) {
        config = { color: priorityColor, bg: `${priorityColor}15` };
      }
      break;
  }

  if (config) {
    return (
      <Badge
        className={cn(className)}
        variant="light"
        color={config.color as any}
        style={{ backgroundColor: config.bg, color: config.color, borderColor: `${config.color}40` }}
        {...props}
      >
        {label}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(className)}
      variant="light"
      color="gray"
      {...props}
    >
      {label}
    </Badge>
  );
}

export function PriorityBadge({ level, className, ...props }: { level: 'High' | 'Medium' | 'Low'; className?: string }) {
  const color = ISSUE_PRIORITY_COLORS[level];
  return (
    <Badge
      className={cn('gap-1.5', className)}
      variant="light"
      color={color as any}
      style={{ backgroundColor: `${color}15`, color, borderColor: `${color}40` }}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {level}
    </Badge>
  );
}