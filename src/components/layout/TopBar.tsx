'use client';

import { useState, type ReactNode } from 'react';
import { Menu as MenuIcon, Search, Bell, LogOut, ChevronDown, X } from 'lucide-react';
import { Button, TextInput, Group, Tooltip, Popover } from '@mantine/core';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useProjectStore } from '@/stores/project.store';
import { cn } from '@/lib/utils';
import { PROJECT_NAVIGATION } from '@/constants';
import { Wordmark } from '@/components/ui/Wordmark';

interface TopBarProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
  project?: { id: string; name: string } | null;
  projects?: { id: string; name: string }[];
  onSwitchProject?: (project: { id: string; name: string }) => void;
  onGoHub?: () => void;
}

export function TopBar({ user, onLogout, project, projects = [], onSwitchProject, onGoHub }: TopBarProps) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setMobileNavOpen, closeAllPanels } = useUIStore();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query && project) {
      router.push(`/projects/${project.id}/files?search=${encodeURIComponent(query)}`);
    }
  };

  const isHub = pathname === '/projects';

  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-surface/95 backdrop-blur-sm" style={{ borderColor: 'var(--color-border)' }}>
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoHub}
            className="md:hidden"
            aria-label="Go to projects"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
          
          <Wordmark size={15} />
          
          {project && (
            <Popover
              opened={switcherOpen}
              onClose={() => setSwitcherOpen(false)}
              position="bottom"
              width={280}
              shadow="lg"
              radius="md"
              withArrow
              classNames={{ dropdown: 'border border-border' }}
            >
              <Popover.Target>
                <Tooltip label="Switch project">
                  <Button
                    variant="subtle"
                    color="primary"
                    size="sm"
                    rightSection={<ChevronDown className="h-4 w-4" />}
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-body-sm"
                  >
                    {project.name}
                  </Button>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                {projects.map((p) => (
                  <Button
                    key={p.id}
                    variant="subtle"
                    fullWidth
                    justify="flex-start"
                    size="sm"
                    radius="md"
                    leftSection={project?.id === p.id ? <span className="w-5 h-5" /> : undefined}
                    rightSection={project?.id === p.id ? <ChevronDown className="h-4 w-4 text-primary" /> : undefined}
                    className={cn('px-4 py-2.5 text-body-sm text-left', project?.id === p.id && 'font-medium text-primary bg-primary-light/50')}
                    onClick={() => {
                      onSwitchProject?.(p);
                      setSwitcherOpen(false);
                    }}
                  >
                    {p.name}
                  </Button>
                ))}
              </Popover.Dropdown>
            </Popover>
          )}
          
          {isHub && !project && (
            <Button variant="ghost" size="sm" onClick={() => setMobileNavOpen(true)} className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
            <TextInput
              placeholder="Search this project..."
              name="search"
              className="w-64 pl-9 pr-3 py-1.5 text-body-sm"
              radius="md"
              size="sm"
            />
          </form>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip label="Notifications">
            <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <Bell className="h-5 w-5" />
            </Button>
          </Tooltip>

          {user && (
            <Popover position="bottom-end" width={200} shadow="lg" radius="md" withArrow>
              <Popover.Target>
                <Button variant="ghost" size="sm" rightSection={<ChevronDown className="h-4 w-4" />}>
                  {user.name}
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <div className="px-3 py-2 text-body-sm font-medium text-text-muted border-b" style={{ borderColor: 'var(--color-border)' }}>
                  Account
                </div>
                <Button
                  variant="subtle"
                  fullWidth
                  justify="flex-start"
                  size="sm"
                  color="red"
                  leftSection={<LogOut className="h-4 w-4" />}
                  onClick={onLogout}
                >
                  Sign out
                </Button>
              </Popover.Dropdown>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}