'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('empty-state', className)}>
      {icon && <div className="empty-state-icon text-5xl mb-3">{icon}</div>}
      <div className="empty-state-title text-heading-sm font-heading font-medium text-text">{title}</div>
      {description && <div className="empty-state-description text-body-sm text-text-muted mt-1">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <div className="text-body-sm text-text-muted">{message}</div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'table-row';
  lines?: number;
}

export function LoadingSkeleton({ className, variant = 'text', lines = 3 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('animate-pulse space-y-4 p-5', className)}>
        <div className="skeleton h-6 w-1/4" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={cn('animate-pulse grid gap-4 px-5 py-3.5', className)}>
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-20" />
      </div>
    );
  }

  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn('skeleton h-4', i === lines - 1 ? 'w-1/2' : 'w-full')} />
      ))}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('empty-state', className)}>
      <div className="empty-state-icon text-5xl mb-3 text-danger">⚠️</div>
      <div className="empty-state-title text-heading-sm font-heading font-medium text-text">{title}</div>
      <div className="empty-state-description text-body-sm text-text-muted mt-1">{message}</div>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}