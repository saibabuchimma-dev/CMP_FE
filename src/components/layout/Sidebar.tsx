'use client';

import { type ReactNode } from 'react';
import { ChevronRight, LayoutGrid, FolderOpen, FileSearch, ClipboardCheck, AlertTriangle, Camera, CalendarDays, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROJECT_NAVIGATION } from '@/constants';

const ICONS: Record<string, ReactNode> = {
  LayoutGrid: <LayoutGrid className="h-5 w-5" />,
  FolderOpen: <FolderOpen className="h-5 w-5" />,
  FileSearch: <FileSearch className="h-5 w-5" />,
  ClipboardCheck: <ClipboardCheck className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Camera: <Camera className="h-5 w-5" />,
  CalendarDays: <CalendarDays className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
};

interface SidebarProps {
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}

export function Sidebar({ active, onSelect, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'hidden w-56 shrink-0 border-r bg-surface py-5 md:block transition-all duration-200',
        className
      )}
      style={{ borderColor: 'var(--color-border)' }}
      role="navigation"
      aria-label="Project navigation"
    >
      <nav className="px-2" aria-label="Project modules">
        {PROJECT_NAVIGATION.map((item) => {
          const isActive = active === item.key;
          const Icon = ICONS[item.icon];
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2.5 text-left text-body-sm transition-all duration-200 rounded-lg',
                isActive
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-text-secondary hover:bg-background hover:text-text',
                'border-l-2',
                isActive ? 'border-primary' : 'border-transparent'
              )}
              style={{
                borderLeftWidth: '2px',
                borderLeftColor: isActive ? 'var(--color-primary)' : 'transparent',
              }}
            >
              {Icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}