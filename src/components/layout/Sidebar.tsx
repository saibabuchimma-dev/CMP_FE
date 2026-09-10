'use client';

import { type ReactNode } from 'react';
import { 
  LayoutGrid, 
  FolderOpen, 
  FileSearch, 
  ClipboardCheck, 
  AlertTriangle, 
  Camera, 
  CalendarDays, 
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useProjectStore } from '@/stores/project.store';

const ICONS: Record<string, ReactNode> = {
  overview: <LayoutGrid className="h-4 w-4 shrink-0" />,
  files: <FolderOpen className="h-4 w-4 shrink-0" />,
  rfis: <FileSearch className="h-4 w-4 shrink-0" />,
  submittals: <ClipboardCheck className="h-4 w-4 shrink-0" />,
  issues: <AlertTriangle className="h-4 w-4 shrink-0" />,
  photos: <Camera className="h-4 w-4 shrink-0" />,
  dailyLog: <CalendarDays className="h-4 w-4 shrink-0" />,
  insights: <BarChart3 className="h-4 w-4 shrink-0" />,
};

const NAVIGATION_GROUPS = [
  {
    title: 'Management',
    items: [
      { key: 'overview', label: 'Overview' },
      { key: 'insights', label: 'Analytics' },
    ],
  },
  {
    title: 'Project Controls',
    items: [
      { key: 'files', label: 'Drawings & Files' },
      { key: 'rfis', label: 'RFIs' },
      { key: 'submittals', label: 'Submittals' },
    ],
  },
  {
    title: 'Site Operations',
    items: [
      { key: 'issues', label: 'Field Issues' },
      { key: 'dailyLog', label: 'Daily Logs' },
      { key: 'photos', label: 'Site Photos' },
    ],
  },
];

interface SidebarProps {
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}

export function Sidebar({ active, onSelect, className }: SidebarProps) {
  const router = useRouter();
  const { selectedProject } = useProjectStore();

  const getBadge = (key: string) => {
    if (!selectedProject) return null;
    switch (key) {
      case 'files':
        return selectedProject.docs.length > 0 ? (
          <span className="ml-auto text-[11px] font-mono text-text-muted">{selectedProject.docs.length}</span>
        ) : null;
      case 'rfis': {
        const open = selectedProject.rfis.filter(r => r.status === 'Open').length;
        return open > 0 ? (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded bg-info-bg text-info">{open}</span>
        ) : null;
      }
      case 'submittals': {
        const pending = selectedProject.submittals.filter(s => s.status === 'Pending' || s.status === 'Revise & Resubmit').length;
        return pending > 0 ? (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded bg-warning-bg text-warning">{pending}</span>
        ) : null;
      }
      case 'issues': {
        const openIssues = selectedProject.issues.filter(i => i.status !== 'Closed').length;
        const hasHigh = selectedProject.issues.some(i => i.priority === 'High' && i.status !== 'Closed');
        return openIssues > 0 ? (
          <span className={cn(
            'ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded',
            hasHigh ? 'bg-danger-bg text-danger' : 'bg-warning-bg text-warning'
          )}>
            {openIssues}
          </span>
        ) : null;
      }
      case 'photos':
        return selectedProject.photos.length > 0 ? (
          <span className="ml-auto text-[11px] font-mono text-text-muted">{selectedProject.photos.length}</span>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <aside
      className={cn(
        'hidden w-60 shrink-0 border-r bg-surface py-4 md:flex md:flex-col justify-between transition-all duration-200 min-h-[calc(100vh-3.5rem)]',
        className
      )}
      style={{ borderColor: 'var(--color-border)' }}
      role="navigation"
      aria-label="Project navigation"
    >
      <div className="space-y-5 px-3">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.key;
                const Icon = ICONS[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelect(item.key)}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3 py-2 text-left text-body-sm transition-all duration-150 rounded-lg',
                      isActive
                        ? 'bg-primary text-surface font-medium shadow-xs'
                        : 'text-text-secondary hover:bg-background hover:text-text'
                    )}
                  >
                    <span className={isActive ? 'text-surface' : 'text-text-muted'}>{Icon}</span>
                    <span className="truncate">{item.label}</span>
                    {getBadge(item.key)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-3 pt-4 border-t mt-4" style={{ borderColor: 'var(--color-border-light)' }}>
        <button
          onClick={() => router.push('/projects')}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-xs text-text-muted hover:text-text hover:bg-background rounded-lg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Projects Directory</span>
        </button>
      </div>
    </aside>
  );
}