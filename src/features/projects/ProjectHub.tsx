'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight, LayoutGrid, MapPin, FolderOpen, FileSearch, AlertTriangle } from 'lucide-react';
import { Button, Card, Group, Text, Skeleton } from '@mantine/core';
import { formatDate, cn } from '@/lib/utils';
import { PROJECT_NAVIGATION } from '@/constants';
import { ProjectStageCompact } from '@/components/ui/ProjectStageIndicator';
import { Wordmark } from '@/components/ui/Wordmark';
import { useProjects } from '@/hooks/useProjects';
import { useProjectStore } from '@/stores/project.store';
import { useAuthStore } from '@/stores/auth.store';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const openIssues = project.issues.filter((i) => i.status !== 'Closed').length;
  const openRfis = project.rfis.filter((r) => r.status === 'Open').length;

  return (
    <Card
      onClick={onClick}
      hover
      className="group cursor-pointer"
      radius="xl"
      withBorder
      shadow="sm"
    >
      <div className="flex items-center gap-5 p-6">
        <ProjectStageCompact stage={project.stage} percentComplete={project.percentComplete} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.03rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}>
              {project.name}
            </h3>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
              {project.location}
            </span>
          </div>
          
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <span>
              {project.stage}
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>·{project.percentComplete}%</span>
            </span>
            <span>{project.docs.length} files</span>
            <span>{openRfis} open RFI{openRfis === 1 ? '' : 's'}</span>
            <span style={{ color: openIssues ? 'var(--color-warning)' : 'var(--color-text-muted)', fontWeight: openIssues ? 500 : 400 }}>
              {openIssues} open issue{openIssues === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 shrink-0 text-text-muted/50 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Card>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card radius="xl" withBorder shadow="sm">
      <div className="p-6">
        <Skeleton height={36} width="80" className="rounded" />
        <Skeleton height={16} width="60%" className="mt-3 rounded" />
        <Skeleton height={14} width="40%" className="mt-3 rounded" />
        <div className="mt-4 flex gap-6">
          <Skeleton height={14} width="80" className="rounded" />
          <Skeleton height={14} width="60" className="rounded" />
          <Skeleton height={14} width="100" className="rounded" />
          <Skeleton height={14} width="100" className="rounded" />
        </div>
      </div>
    </Card>
  );
}

export function ProjectHubContent({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const { data: projects, isLoading, error } = useProjects();
  const { setSelectedProject } = useProjectStore();

  const handleOpen = (project: Project) => {
    setSelectedProject(project);
    onOpenProject(project);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state py-12">
        <div className="empty-state-icon text-5xl mb-3">⚠️</div>
        <div className="empty-state-title text-heading-sm font-heading font-medium text-text">Failed to load projects</div>
        <div className="empty-state-description text-body-sm text-text-muted mt-1">
          {error.message ?? 'An unexpected error occurred'}
        </div>
        <Button onClick={() => window.location.reload()} className="mt-4" size="sm">
          Try again
        </Button>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="empty-state py-12">
        <div className="empty-state-icon text-5xl mb-3">📁</div>
        <div className="empty-state-title text-heading-sm font-heading font-medium text-text">No projects yet</div>
        <div className="empty-state-description text-body-sm text-text-muted mt-1">
          Create your first project to get started
        </div>
        <Button className="mt-4" size="sm">Create project</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onClick={() => handleOpen(project)} />
      ))}
    </div>
  );
}

export function ProjectHubPage({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { data: projects } = useProjects();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div style={{ background: 'var(--color-background)', minHeight: '100dvh', fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      <header className="sticky top-0 z-30 h-14 border-b bg-surface/95 backdrop-blur-sm" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-full mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <Wordmark size={14} dark={false} />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </Button>
            <span className="hidden text-body-sm md:inline" style={{ color: 'var(--color-text-muted)' }}>Demo Engineer</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17 21 12 16 7" />
                <path d="M21 12H9" />
              </svg>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.375rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'var(--color-text)',
            }}>
              Your projects
            </h1>
            <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
              {projects?.length ?? 0} active — sorted by recent activity
            </p>
          </div>
        </div>

        <ProjectHubContent onOpenProject={onOpenProject} />
      </main>
    </div>
  );
}