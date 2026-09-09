'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PROJECT_NAVIGATION } from '@/constants';

const ICONS: Record<string, ReactNode> = {
  LayoutGrid: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  FolderOpen: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>,
  FileSearch: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21A2 2 0 0 0 6 22.17V20"/><path d="m16 2-1.68 7.08A12.06 12.06 0 0 1 8.5 18.7"/><circle cx="17.5" cy="17.5" r="6.5"/></svg>,
  ClipboardCheck: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="14" x="8" y="2" rx="1" ry="1"/><path d="M16 14H8"/><path d="M16 18H8"/><path d="M16 10H8"/><path d="m9 14 2 2 4-4"/></svg>,
  AlertTriangle: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  Camera: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  CalendarDays: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>,
  BarChart3: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M19 9V3"/><path d="M15 14V3"/><path d="M11 19V3"/></svg>,
};

interface MobileTabsProps {
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}

export function MobileTabs({ active, onSelect, className }: MobileTabsProps) {
  return (
    <div
      className={cn(
        'flex gap-1 overflow-x-auto border-b bg-surface px-3 py-2 md:hidden scrollbar-thin',
        className
      )}
      style={{ borderColor: 'var(--color-border)' }}
      role="tablist"
      aria-label="Project modules"
    >
      {PROJECT_NAVIGATION.map((item) => {
        const isActive = active === item.key;
        const Icon = ICONS[item.icon];
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(item.key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-body-xs font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'bg-primary text-surface'
                : 'text-text-secondary hover:bg-background hover:text-text'
            )}
          >
            {Icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}