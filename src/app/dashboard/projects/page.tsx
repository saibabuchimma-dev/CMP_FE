'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { useProjectStore } from '@/stores/project.store';
import { useUIStore } from '@/stores/ui.store';
import { ProjectHubPage } from '@/features/projects/ProjectHub';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Wordmark } from '@/components/ui/Wordmark';
import { LogOut, ChevronDown, LayoutGrid, Settings } from 'lucide-react';
import { Button, Menu, Group } from '@mantine/core';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setSelectedProject } = useProjectStore();
  const { sidebarOpen, setSidebarOpen, closeAllPanels } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleOpenProject = (project: { id: string; name: string; location: string; stage: string; percentComplete: number }) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      onGoHub={() => {}}
      activeModule=""
    >
      <ProjectHubPage onOpenProject={handleOpenProject} />
    </DashboardLayout>
  );
}