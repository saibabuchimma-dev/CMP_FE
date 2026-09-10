'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Building2,
  MapPin,
  FolderOpen,
  FileSearch,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  TrendingUp,
} from 'lucide-react';
import { Modal, TextInput, Select, Progress, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { formatDate, cn } from '@/lib/utils';
import { PROJECT_STAGES, STAGE_COLORS, PROJECT_NAVIGATION } from '@/constants';
import { ProjectStageCompact } from '@/components/ui/ProjectStageIndicator';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useProjectStore } from '@/stores/project.store';
import type { Project, ProjectStage } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const openIssues = project.issues.filter((i) => i.status !== 'Closed').length;
  const highPriorityIssues = project.issues.filter(
    (i) => i.priority === 'High' && i.status !== 'Closed'
  ).length;
  const openRfis = project.rfis.filter((r) => r.status === 'Open').length;
  const stageColor = STAGE_COLORS[project.stage] || '#1F3A4E';
  const coverPhoto = project.photos?.[0]?.url;

  return (
    <div
      onClick={onClick}
      className="shadow-xs group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover"
    >
      <div className="flex flex-1 flex-col justify-between space-y-5 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-body-xs font-semibold"
                style={{
                  backgroundColor: `${stageColor}15`,
                  color: stageColor,
                  border: `1px solid ${stageColor}30`,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stageColor }} />
                {project.stage}
              </span>
              <span className="font-mono text-[11px] font-bold text-text-muted bg-background px-2 py-0.5 rounded-md border border-border/70">
                {project.percentComplete}% Complete
              </span>
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-bold text-text leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {project.name}
            </h3>

            <p className="mt-1.5 flex items-center gap-1.5 text-body-xs text-text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted/70" />
              <span className="truncate">{project.location}</span>
            </p>
          </div>

          {coverPhoto && (
            <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-border shadow-xs bg-background">
              <img
                src={coverPhoto}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-muted">Lifecycle Progress</span>
            <span className="font-mono font-semibold text-text">{project.percentComplete}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border-light">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${project.percentComplete}%`, backgroundColor: stageColor }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border-light pt-4 text-body-xs text-text-secondary">
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1"
              title="Controlled Documents"
            >
              <FolderOpen className="h-3.5 w-3.5 text-text-muted" />
              <span className="font-mono font-bold text-text">{project.docs.length}</span>
            </span>

            <span
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1"
              title="Open RFIs"
            >
              <FileSearch className="h-3.5 w-3.5 text-text-muted" />
              <span className={cn('font-mono font-bold', openRfis > 0 ? 'text-info' : 'text-text')}>
                {openRfis}
              </span>
              <span className="hidden text-[11px] text-text-muted sm:inline">RFIs</span>
            </span>

            <span
              className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1"
              title="Open Snags / Issues"
            >
              <AlertTriangle
                className={cn('h-3.5 w-3.5', openIssues > 0 ? 'text-warning' : 'text-text-muted')}
              />
              <span
                className={cn(
                  'font-mono font-bold',
                  highPriorityIssues > 0
                    ? 'text-danger'
                    : openIssues > 0
                      ? 'text-warning'
                      : 'text-text'
                )}
              >
                {openIssues}
              </span>
              <span className="hidden text-[11px] text-text-muted sm:inline">snags</span>
            </span>
          </div>

          <div className="shadow-2xs flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-surface">
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="shadow-xs animate-pulse space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-7">
      <div className="h-40 rounded-xl bg-border-light" />
      <div className="h-6 w-3/4 rounded bg-border-light" />
      <div className="h-4 w-1/2 rounded bg-border-light" />
      <div className="mt-4 h-2 w-full rounded-full bg-border-light" />
      <div className="flex justify-between border-t border-border-light pt-4">
        <div className="h-4 w-32 rounded bg-border-light" />
        <div className="h-4 w-6 rounded bg-border-light" />
      </div>
    </div>
  );
}

export function ProjectHubPage({ onOpenProject }: { onOpenProject: (project: Project) => void }) {
  const router = useRouter();
  const { data: projects, isLoading, error } = useProjects();
  const { setSelectedProject } = useProjectStore();
  const createProjectMutation = useCreateProject();

  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectStage, setNewProjectStage] = useState<ProjectStage>('Foundation');

  const handleOpen = (project: Project) => {
    setSelectedProject(project);
    onOpenProject(project);
  };

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const matchStage = stageFilter === 'All' || p.stage === stageFilter;
      const matchQuery =
        query.trim() === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase());
      return matchStage && matchQuery;
    });
  }, [projects, stageFilter, query]);

  const totalProjects = projects?.length || 0;
  const avgCompletion =
    totalProjects > 0
      ? Math.round(projects!.reduce((acc, p) => acc + p.percentComplete, 0) / totalProjects)
      : 0;
  const totalOpenIssues =
    projects?.reduce((acc, p) => acc + p.issues.filter((i) => i.status !== 'Closed').length, 0) ||
    0;
  const totalOpenRfis =
    projects?.reduce((acc, p) => acc + p.rfis.filter((r) => r.status === 'Open').length, 0) || 0;

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newProjectLocation.trim()) return;

    try {
      await createProjectMutation.mutateAsync({
        name: newProjectName.trim(),
        location: newProjectLocation.trim(),
        stage: newProjectStage,
      });

      notifications.show({
        title: 'Project Initialized',
        message: `${newProjectName} added to portfolio successfully.`,
        color: 'green',
      });

      setNewProjectName('');
      setNewProjectLocation('');
      setNewProjectModalOpen(false);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Could not create project. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16 sm:space-y-10">
      <div className="flex flex-col gap-4 border-b border-border pb-7 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-md bg-primary-light px-2.5 py-1 text-body-xs font-semibold uppercase tracking-wider text-primary">
            <Building2 className="h-3.5 w-3.5" />
            Enterprise Portfolio
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-4xl">
            Active Construction Projects
          </h1>
          <p className="mt-2 max-w-2xl text-body-sm leading-relaxed text-text-secondary">
            Centralized visibility into jobsite progress, engineering submittals, RFIs, and safety
            snags across all active sites.
          </p>
        </div>

        <button
          onClick={() => setNewProjectModalOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl bg-primary p-2 px-4 py-2.5 text-body-sm font-medium text-surface shadow-sm transition-all hover:bg-primary/90 hover:shadow active:scale-95 md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="shadow-xs flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-card-hover sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Total Active Sites
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {totalProjects}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            <span className="font-semibold text-success">100% active</span>
            <span>· Metro Urban Cluster</span>
          </div>
        </div>

        <div className="shadow-xs flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-card-hover sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Avg Stage Progress
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {avgCompletion}%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-text-muted">
            <Clock className="h-3.5 w-3.5 text-text-muted" />
            <span>Across all project milestones</span>
          </div>
        </div>

        <div className="shadow-xs flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-card-hover sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Open Technical RFIs
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/10 text-info">
              <FileSearch className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {totalOpenRfis}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-info">
            <span>Pending consultant response</span>
          </div>
        </div>

        <div className="shadow-xs flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-card-hover sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Active Field Snags
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {totalOpenIssues}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-text-muted">
            <span>Safety & QA/QC punch items</span>
          </div>
        </div>
      </div>

      <div className="shadow-xs flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-3 p-4 sm:flex-row sm:p-5">
        <div className="scrollbar-thin flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {['All', ...PROJECT_STAGES].map((stage) => {
            const isActive = stageFilter === stage;
            return (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={cn(
                  'shrink-0 rounded-xl p-2 px-3.5 py-2 text-body-xs font-semibold transition-all',
                  isActive
                    ? 'shadow-xs bg-primary text-surface'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                {stage}
              </button>
            );
          })}
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              style={{ left: '15px' }}
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects by name or location..."
              className="w-full rounded-xl border border-border bg-background/80 py-2 pr-4 text-body-sm transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
              style={{ paddingLeft: '56px' }}
            />
          </div>

          <div className="flex items-center rounded-xl border border-border bg-background p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                viewMode === 'grid'
                  ? 'shadow-xs bg-surface text-primary'
                  : 'text-text-muted hover:text-text'
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'rounded-lg p-2 transition-colors',
                viewMode === 'table'
                  ? 'shadow-xs bg-surface text-primary'
                  : 'text-text-muted hover:text-text'
              )}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="empty-state rounded-2xl border border-border bg-surface p-8 py-16 text-center">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-danger" />
          <div className="empty-state-title font-heading text-heading-sm font-semibold text-text">
            Failed to load projects
          </div>
          <div className="empty-state-description mx-auto mt-2 max-w-md text-body-sm text-text-muted">
            {error.message || 'An unexpected error occurred while loading projects.'}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-body-sm font-medium text-surface transition-all hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-state rounded-2xl border border-border bg-surface p-8 py-16 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-text-muted/40" />
          <div className="empty-state-title font-heading text-heading-sm font-semibold text-text">
            {query || stageFilter !== 'All'
              ? 'No projects match your filter'
              : 'No projects in portfolio'}
          </div>
          <div className="empty-state-description mx-auto mt-2 max-w-sm text-body-sm text-text-muted">
            {query || stageFilter !== 'All'
              ? 'Try adjusting your search terms or stage filter.'
              : 'Add your first construction project to begin monitoring site operations.'}
          </div>
          <button
            onClick={() => {
              setQuery('');
              setStageFilter('All');
              setNewProjectModalOpen(true);
            }}
            className="shadow-xs mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-body-sm font-medium text-surface transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => handleOpen(project)} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="shadow-xs overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead className="border-b border-border bg-background text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Files</th>
                  <th className="px-6 py-4">RFIs</th>
                  <th className="px-6 py-4">Snags</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredProjects.map((p) => {
                  const openIssues = p.issues.filter((i) => i.status !== 'Closed').length;
                  const openRfis = p.rfis.filter((r) => r.status === 'Open').length;
                  const stageColor = STAGE_COLORS[p.stage] || '#1F3A4E';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleOpen(p)}
                      className="cursor-pointer transition-colors hover:bg-background/80"
                    >
                      <td className="py-4.5 px-6 font-medium text-text">
                        <div className="flex items-center gap-2.5">
                          <Building2 className="h-4 w-4 shrink-0 text-primary" />
                          <span className="font-semibold transition-colors hover:text-primary">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 text-body-xs text-text-secondary">{p.location}</td>
                      <td className="py-4.5 px-6">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                          style={{ backgroundColor: `${stageColor}15`, color: stageColor }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: stageColor }}
                          />
                          {p.stage}
                        </span>
                      </td>
                      <td className="py-4.5 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-border-light">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${p.percentComplete}%`,
                                backgroundColor: stageColor,
                              }}
                            />
                          </div>
                          <span className="font-mono text-body-xs text-text-muted">
                            {p.percentComplete}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4.5 px-6 font-mono text-body-xs text-text-muted">
                        {p.docs.length}
                      </td>
                      <td className="py-4.5 px-6">
                        <span
                          className={cn(
                            'text-body-xs font-semibold',
                            openRfis > 0 ? 'text-info' : 'text-text-muted'
                          )}
                        >
                          {openRfis} open
                        </span>
                      </td>
                      <td className="py-4.5 px-6">
                        <span
                          className={cn(
                            'text-body-xs font-semibold',
                            openIssues > 0 ? 'text-warning' : 'text-text-muted'
                          )}
                        >
                          {openIssues} open
                        </span>
                      </td>
                      <td className="py-4.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-body-xs font-semibold text-primary hover:underline">
                          Open <ChevronRight className="h-4 w-4" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        opened={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        title={
          <span className="font-heading text-lg font-semibold text-text">
            Initialize New Project
          </span>
        }
        centered
        radius="lg"
        size="md"
      >
        <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g., Brigade Tech Gardens — Block D"
              className="w-full rounded-lg border border-border px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Jobsite Location *
            </label>
            <input
              type="text"
              required
              value={newProjectLocation}
              onChange={(e) => setNewProjectLocation(e.target.value)}
              placeholder="e.g., Brookefield, Bengaluru"
              className="w-full rounded-lg border border-border px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Current Construction Stage
            </label>
            <select
              value={newProjectStage}
              onChange={(e) => setNewProjectStage(e.target.value as ProjectStage)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
            >
              {PROJECT_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setNewProjectModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-body-sm text-text transition-colors hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-body-sm font-medium text-surface transition-colors hover:bg-primary/90"
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
