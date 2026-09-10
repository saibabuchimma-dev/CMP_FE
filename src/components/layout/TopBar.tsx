'use client';

import { useState } from 'react';
import { 
  Search, 
  Bell, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Building2, 
  CheckCircle2, 
  User as UserIcon,
  HardHat
} from 'lucide-react';
import { Popover } from '@mantine/core';
import { useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils';
import { PROJECT_NAVIGATION } from '@/constants';
import { Wordmark } from '@/components/ui/Wordmark';

interface TopBarProps {
  user: { name: string; email: string; role?: string } | null;
  onLogout: () => void;
  project?: { id: string; name: string; stage?: string; percentComplete?: number } | null;
  projects?: { id: string; name: string; stage?: string; percentComplete?: number }[];
  onSwitchProject?: (project: { id: string; name: string }) => void;
  onGoHub?: () => void;
}

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'RFI-118 Answered',
    desc: 'Ekaa Studio replied to Beam-Column detail at Grid D4',
    time: '12m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'High Priority Safety Snag',
    desc: 'Missing edge protection on Floor 12 flagged by Safety Officer',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Concrete Pour Approved',
    desc: 'SUB-041 M40 mix design approved for Level 13 slab',
    time: '3h ago',
    unread: false,
  },
];

export function TopBar({ user, onLogout, project, projects = [], onSwitchProject, onGoHub }: TopBarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const router = useRouter();
  const pathname = usePathname();

  const isHub = pathname === '/projects' || pathname === '/dashboard/projects';

  const currentNav = PROJECT_NAVIGATION.find(item => 
    pathname.includes(item.key === 'overview' ? '' : item.href.split('/').pop() || '')
  );

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query && project) {
      router.push(`/projects/${project.id}/files?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-surface/95 backdrop-blur-md" style={{ borderColor: 'var(--color-border)' }}>
      <div className="h-full flex items-center justify-between px-3 md:px-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            onClick={onGoHub || (() => router.push('/projects'))}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            title="Return to Projects Portfolio"
          >
            <Wordmark size={15} />
          </button>

          <span className="hidden sm:inline text-text-muted/40 font-light">/</span>

          {project ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <Popover
                opened={switcherOpen}
                onClose={() => setSwitcherOpen(false)}
                position="bottom-start"
                width={320}
                shadow="lg"
                radius="md"
                withArrow
              >
                <Popover.Target>
                  <button
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-body-sm font-medium text-text hover:bg-background transition-colors max-w-[200px] sm:max-w-[260px] truncate"
                  >
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{project.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-text-muted shrink-0 ml-0.5" />
                  </button>
                </Popover.Target>
                <Popover.Dropdown className="p-2 border border-border bg-surface">
                  <div className="px-2.5 py-1.5 text-body-xs font-semibold uppercase tracking-wider text-text-muted border-b mb-1" style={{ borderColor: 'var(--color-border-light)' }}>
                    Switch Project
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin">
                    {projects.map((p) => {
                      const isSelected = project?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSwitchProject?.(p);
                            setSwitcherOpen(false);
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 text-left text-body-sm rounded-md transition-colors',
                            isSelected 
                              ? 'bg-primary-light font-medium text-primary' 
                              : 'hover:bg-background text-text'
                          )}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate">{p.name}</div>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
                    <button
                      onClick={() => {
                        setSwitcherOpen(false);
                        if (onGoHub) onGoHub();
                        else router.push('/projects');
                      }}
                      className="w-full text-center py-1 text-body-xs text-primary font-medium hover:underline"
                    >
                      View all projects portfolio &rarr;
                    </button>
                  </div>
                </Popover.Dropdown>
              </Popover>

              {currentNav && currentNav.key !== 'overview' && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-text-muted/50 shrink-0" />
                  <span className="hidden md:inline text-body-sm text-text-secondary font-medium">
                    {currentNav.label}
                  </span>
                </>
              )}
            </div>
          ) : (
            <span className="text-body-sm text-text-secondary font-medium hidden sm:inline">
              Portfolio Directory
            </span>
          )}
        </div>

        {project && (
          <div className="hidden lg:flex items-center gap-2 max-w-sm w-full mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                name="search"
                placeholder="Search drawings, RFIs, specs, issues..."
                className="w-full pl-9 pr-3 py-1.5 text-body-sm bg-background/70 rounded-lg border border-border focus:bg-surface focus:border-primary focus:outline-none transition-all"
              />
            </form>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Popover
            opened={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            position="bottom-end"
            width={340}
            shadow="lg"
            radius="md"
            withArrow
          >
            <Popover.Target>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-text-secondary hover:bg-background hover:text-text transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger ring-2 ring-surface" />
                )}
              </button>
            </Popover.Target>
            <Popover.Dropdown className="p-0 border border-border bg-surface overflow-hidden">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border-light)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm font-semibold text-text">Site Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-danger-bg text-danger">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead} 
                    className="text-body-xs text-primary hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-border-light max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      'p-3 text-body-sm transition-colors hover:bg-background/80',
                      item.unread && 'bg-primary-light/30'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-text text-body-xs">{item.title}</p>
                      <span className="text-[10px] text-text-muted shrink-0">{item.time}</span>
                    </div>
                    <p className="text-body-xs text-text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Popover.Dropdown>
          </Popover>

          <Popover position="bottom-end" width={220} shadow="lg" radius="md" withArrow>
            <Popover.Target>
              <button className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-background transition-colors text-left">
                <div className="w-7 h-7 rounded-full bg-primary text-surface flex items-center justify-center font-heading font-semibold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-body-xs font-semibold text-text leading-tight">{user?.name || 'Engineer'}</div>
                  <div className="text-[10px] text-text-muted leading-tight">General Contractor</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
              </button>
            </Popover.Target>
            <Popover.Dropdown className="p-1 border border-border bg-surface">
              <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
                <div className="text-body-xs font-semibold text-text">{user?.name || 'Demo Engineer'}</div>
                <div className="text-[11px] text-text-muted truncate">{user?.email || 'admin@buildbetter.com'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-primary-light text-primary">
                  <HardHat className="h-3 w-3" />
                  <span>Site Engineer</span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-body-xs text-text hover:bg-background rounded transition-colors text-left"
                >
                  <UserIcon className="h-3.5 w-3.5 text-text-muted" />
                  <span>Settings & Preferences</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-body-xs text-danger hover:bg-danger-bg rounded transition-colors text-left mt-1"
                >
                  <LogOut className="h-3.5 w-3.5 text-danger" />
                  <span>Sign out</span>
                </button>
              </div>
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </header>
  );
}