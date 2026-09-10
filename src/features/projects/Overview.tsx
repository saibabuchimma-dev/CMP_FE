'use client';

import {
  AlertTriangle,
  Clock,
  FileSearch,
  FolderOpen,
  CheckCircle2,
  CalendarDays,
  Users,
  ChevronRight,
  CloudSun,
  Wind,
  Droplets,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Compass,
  Hammer,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn, formatDate } from '@/lib/utils';
import { ProjectStageIndicator } from '@/components/ui/ProjectStageIndicator';
import { PriorityBadge } from '@/components/ui/Badge';
import { STAGE_COLORS } from '@/constants';
import type { Project } from '@/types';

interface OverviewProps {
  project: Project;
}

export function Overview({ project }: OverviewProps) {
  const router = useRouter();

  const openIssues = project.issues.filter((i) => i.status !== 'Closed');
  const highPriorityIssues = openIssues.filter((i) => i.priority === 'High');
  const openRfis = project.rfis.filter((r) => r.status === 'Open');
  const pendingSubmittals = project.submittals.filter(
    (s) => s.status === 'Pending' || s.status === 'Revise & Resubmit'
  );
  const stageColor = STAGE_COLORS[project.stage] || '#1F3A4E';

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              {project.location}
            </span>
            <span className="text-border">·</span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${stageColor}15`, color: stageColor }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stageColor }} />
              {project.stage}
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {project.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => router.push(`/projects/${project.id}/daily-log`)}
            className="shadow-xs inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-body-xs font-medium text-text transition-all hover:border-primary/40 hover:bg-background"
          >
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span>Daily Log</span>
          </button>
          <button
            onClick={() => router.push(`/projects/${project.id}/issues`)}
            className="shadow-xs inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-body-xs font-medium text-text transition-all hover:border-primary/40 hover:bg-background"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span>Report Snag</span>
          </button>
          <button
            onClick={() => router.push(`/projects/${project.id}/rfis`)}
            className="shadow-xs inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-body-xs font-medium text-text transition-all hover:border-primary/40 hover:bg-background"
          >
            <FileSearch className="h-3.5 w-3.5 text-info" />
            <span>Draft RFI</span>
          </button>
          <button
            onClick={() => router.push(`/projects/${project.id}/files`)}
            className="shadow-xs inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-body-xs font-medium text-surface transition-all hover:bg-primary/90"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span>Upload Drawing</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="shadow-xs flex flex-col justify-between rounded-2xl border border-border bg-surface p-7 sm:p-8 lg:col-span-2">
          <div>
            <div className="flex items-center justify-between p-2">
              <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
                Construction Milestone & Schedule
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Schedule On Track
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 p-3">
              <div>
                <span className="font-heading text-3xl font-bold tracking-tight text-text sm:text-4xl">
                  {project.percentComplete}%
                </span>
                <span className="ml-2.5 text-body-xs font-medium text-text-muted">
                  Overall Handover Target
                </span>
              </div>
              <span className="rounded-md bg-primary-light px-2.5 py-1 text-body-xs font-semibold text-primary">
                Current Phase: {project.stage}
              </span>
            </div>

            <div className="mt-4 p-1">
              <div className="h-3 w-full overflow-hidden rounded-full bg-border-light">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${project.percentComplete}%`, backgroundColor: stageColor }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border-light p-5 pt-5 text-body-xs sm:grid-cols-3">
              <div className="rounded-xl border border-border/50 bg-background p-3">
                <span className="block text-[11px] font-medium text-text-muted">
                  Critical Milestone
                </span>
                <span className="mt-1 block font-semibold text-text">Transfer Slab Pour</span>
              </div>
              <div className="rounded-xl border border-border/50 bg-background p-3">
                <span className="block text-[11px] font-medium text-text-muted">Target Date</span>
                <span className="mt-1 block font-mono font-semibold text-text">Sept 18, 2026</span>
              </div>
              <div className="rounded-xl border border-border/50 bg-background p-3">
                <span className="block text-[11px] font-medium text-text-muted">
                  Lead Contractor
                </span>
                <span className="mt-1 block font-semibold text-text">Apex Infrastructure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="shadow-xs flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 p-7 sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
                Jobsite Conditions
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-success-bg px-2 py-0.5 text-[10px] font-bold text-success">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                LIVE
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="font-heading text-3xl font-bold text-text">29°C</div>
                <div className="mt-1 text-body-xs text-text-muted">Clear & Sunny · Bengaluru</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning-bg text-warning">
                <CloudSun className="h-8 w-8" />
              </div>
            </div>

            <div className="mt-6 space-y-3 p-2 text-body-xs">
              <div className="mb-3 flex items-center justify-between rounded-xl border border-border/50 bg-background p-3 text-text-secondary">
                <span className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-text-muted" /> Wind Speed
                </span>
                <span className="font-semibold text-text">12 km/h (Safe for Cranes)</span>
              </div>
              <div className="mb-3 flex items-center justify-between rounded-xl border border-border/50 bg-background p-3 text-text-secondary">
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-text-muted" /> Humidity / Rain
                </span>
                <span className="font-semibold text-text">54% · 0% Precip</span>
              </div>
              <div className="mb-2 flex items-center justify-between rounded-xl border border-border/50 bg-background p-3 text-text-secondary">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-success" /> Site Status
                </span>
                <span className="font-semibold text-success">Day Shift (07:00–18:00)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          onClick={() => router.push(`/projects/${project.id}/files`)}
          className="shadow-xs flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-card-hover"
        >
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Drawings & Files
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {project.docs.length}
          </div>
          <div className="mt-2 text-[12px] text-text-muted">
            <span className="font-semibold text-text">
              {project.docs.filter((d) => d.status === 'review').length}
            </span>{' '}
            under review
          </div>
        </div>

        <div
          onClick={() => router.push(`/projects/${project.id}/rfis`)}
          className="shadow-xs flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-card-hover"
        >
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Open RFIs
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-info/10 text-info">
              <FileSearch className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {openRfis.length}
          </div>
          <div className="mt-2 text-[12px] font-medium text-info">
            {openRfis.filter((r) => r.ballInCourt.toLowerCase().includes('consultant')).length}{' '}
            pending consultant
          </div>
        </div>

        <div
          onClick={() => router.push(`/projects/${project.id}/submittals`)}
          className="shadow-xs flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-card-hover"
        >
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Submittals
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Hammer className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {pendingSubmittals.length}
          </div>
          <div className="mt-2 text-[12px] text-text-muted">
            {project.submittals.length} total packages
          </div>
        </div>

        <div
          onClick={() => router.push(`/projects/${project.id}/issues`)}
          className="shadow-xs flex cursor-pointer flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-card-hover"
        >
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">
              Field Snags
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertTriangle
                className={cn(
                  'h-4 w-4',
                  highPriorityIssues.length > 0 ? 'text-danger' : 'text-warning'
                )}
              />
            </div>
          </div>
          <div className="mt-3 font-heading text-3xl font-bold tracking-tight text-text">
            {openIssues.length}
          </div>
          <div className="mt-2 text-[12px] font-medium text-danger">
            {highPriorityIssues.length} high priority
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="shadow-xs rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-bg text-warning">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h3 className="font-heading text-base font-bold leading-tight text-text sm:text-lg">
                  Requires Immediate Attention
                </h3>
                <p className="mt-1 text-[11px] text-text-muted">
                  Open issues and RFIs requiring action
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] font-semibold text-text-muted">
              {openIssues.length + openRfis.length} items
            </span>
          </div>

          <div className="space-y-5 mt-4">
            {openIssues.slice(0, 3).map((issue) => (
              <div
                key={issue.id}
                onClick={() => router.push(`/projects/${project.id}/issues`)}
                className="p-3 hover:shadow-2xs group cursor-pointer rounded-xl border border-border bg-background/40 transition-all hover:border-warning/30 hover:bg-background"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 pt-0.5">
                    <PriorityBadge level={issue.priority} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-[13px] font-semibold leading-5 text-text group-hover:text-primary">
                        {issue.title}
                      </p>

                      <span className="shrink-0 font-mono text-[10px] text-text-muted">
                        {formatDate(issue.date)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{issue.location}</span>
                      <span className="text-border">•</span>
                      <span className="shrink-0">{issue.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {openRfis.slice(0, 2).map((rfi) => (
              <div
                key={rfi.id}
                onClick={() => router.push(`/projects/${project.id}/rfis`)}
                className="p-3 hover:shadow-2xs group cursor-pointer rounded-xl border border-border bg-background/40 transition-all hover:border-info/30 hover:bg-background"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-md bg-info-bg px-2 py-1 text-[10px] font-bold text-info">
                    RFI
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate text-[13px] font-semibold leading-5 text-text group-hover:text-primary">
                        {rfi.subject}
                      </p>

                      <span className="shrink-0 font-mono text-[10px] font-semibold text-danger">
                        Due {formatDate(rfi.due)}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] leading-4 text-text-muted">
                      <span className="font-medium text-text-secondary">Ball in court:</span>{' '}
                      {rfi.ballInCourt}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {openIssues.length === 0 && openRfis.length === 0 && (
              <div className="rounded-xl border border-border bg-background/40 px-5 py-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-success" />

                <p className="text-sm font-semibold text-text">All caught up!</p>

                <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-5 text-text-muted">
                  No pending field observations or overdue RFIs.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="shadow-xs rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h3 className="font-heading text-base font-bold leading-tight text-text sm:text-lg">
                  Recent Site Daily Logs
                </h3>

                <p className="mt-1 text-[11px] text-text-muted">Latest activity from the jobsite</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/projects/${project.id}/daily-log`)}
              className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-5">
            {project.dailyLogs.slice(0, 3).map((log) => (
              <div
                key={log.date}
                onClick={() => router.push(`/projects/${project.id}/daily-log`)}
                className="p-3 mt-2 hover:shadow-2xs group cursor-pointer rounded-xl border border-border bg-background/40 transition-all hover:border-primary/30 hover:bg-background"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] font-semibold text-text">
                    {formatDate(log.date)}
                  </span>

                  <span className="shrink-0 rounded-md bg-primary/5 px-2 py-1 font-mono text-[10px] font-semibold text-primary">
                    {log.manpower} workers
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[10px] text-text-muted">
                  <span>{log.weather}</span>
                  <span className="text-border">•</span>
                  <span>{log.temperature}</span>
                </div>

                <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-text-secondary">
                  {log.summary}
                </p>

                {log.delays && log.delays !== 'None' && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning-bg px-2.5 py-2 text-[10px] font-medium text-warning">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-semibold">Delay:</span>
                    <span className="truncate">{log.delays}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
