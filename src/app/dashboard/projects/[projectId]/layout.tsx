'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useProjectStore } from '@/stores/project.store';
import { useUIStore } from '@/stores/ui.store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getProjectById } from '@/data/projects';
import { PROJECT_NAVIGATION } from '@/constants';
import { cn } from '@/lib/utils';
import { Wordmark } from '@/components/ui/Wordmark';
import { LogOut, ChevronDown, LayoutGrid, Settings, ArrowLeft } from 'lucide-react';
import { Button, Menu, Group, TextInput } from '@mantine/core';
import { useProjects } from '@/hooks/useProjects';
import { useProject } from '@/hooks/useProjects';

export default function ProjectWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { selectedProject, setSelectedProject } = useProjectStore();
  const { setSidebarOpen, closeAllPanels } = useUIStore();
  const projectId = params.projectId as string;

  const { data: projects } = useProjects();
  const { data: project, isLoading } = useProject(projectId);

  const effectiveProject = project ?? getProjectById(projectId);
  const allProjects = projects ?? [];

  useEffect(() => {
    if (effectiveProject && !selectedProject) {
      setSelectedProject(effectiveProject);
    }
  }, [effectiveProject, selectedProject, setSelectedProject]);

  const currentModule = PROJECT_NAVIGATION.find(item => 
    pathname === `/projects/${projectId}${item.href.replace('/projects/[projectId]', '')}` ||
    (item.key === 'overview' && pathname === `/projects/${projectId}`)
  )?.key ?? 'overview';

  const handleModuleSelect = (key: string) => {
    const item = PROJECT_NAVIGATION.find(n => n.key === key);
    if (item) {
      const href = item.href.replace('[projectId]', projectId);
      router.push(href);
    }
  };

  const handleSwitchProject = (proj: { id: string; name: string }) => {
    router.push(`/projects/${proj.id}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleGoHub = () => {
    router.push('/projects');
  };

  if (isLoading && !effectiveProject) {
    return null;
  }

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      project={effectiveProject ? { id: effectiveProject.id, name: effectiveProject.name } : null}
      projects={allProjects.map(p => ({ id: p.id, name: p.name }))}
      onSwitchProject={handleSwitchProject}
      onGoHub={handleGoHub}
      activeModule={currentModule}
      onModuleSelect={handleModuleSelect}
    >
      {children}
    </DashboardLayout>
  );
}