'use client';

import { type ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileTabs } from './MobileTabs';
import { useUIStore } from '@/stores/ui.store';
import { useProjectStore } from '@/stores/project.store';
import { useAuthStore } from '@/stores/auth.store';

interface DashboardLayoutProps {
  children: ReactNode;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  project?: { id: string; name: string } | null;
  projects?: { id: string; name: string }[];
  onSwitchProject?: (project: { id: string; name: string }) => void;
  onGoHub?: () => void;
  activeModule?: string;
  onModuleSelect?: (key: string) => void;
}

export function DashboardLayout({
  children,
  user,
  onLogout,
  project,
  projects = [],
  onSwitchProject,
  onGoHub,
  activeModule,
  onModuleSelect,
}: DashboardLayoutProps) {
  const { sidebarOpen, mobileNavOpen, closeAllPanels, setSidebarOpen, setMobileNavOpen } = useUIStore();
  const { selectedProject } = useProjectStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (selectedProject && !project) {
      console.warn('Project mismatch in DashboardLayout');
    }
  }, [selectedProject, project, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background font-body text-text">
      <TopBar
        user={user}
        onLogout={onLogout}
        project={project}
        projects={projects}
        onSwitchProject={onSwitchProject}
        onGoHub={onGoHub}
      />

      <div className="flex flex-1">
        {project && (
          <Sidebar
            active={activeModule ?? ''}
            onSelect={onModuleSelect ?? (() => {})}
            className={cn(sidebarOpen ? 'block' : 'hidden md:flex')}
          />
        )}

        <main className="flex-1 min-w-0">
          {project && (
            <MobileTabs active={activeModule ?? ''} onSelect={onModuleSelect ?? (() => {})} />
          )}

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeAllPanels}
          aria-hidden="true"
        />
      )}
    </div>
  );
}