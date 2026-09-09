'use client';

import { AlertTriangle, Clock, FileSearch, FolderOpen, CheckCircle2, XCircle, PauseCircle, MapPin, CalendarDays, Users, ChevronRight } from 'lucide-react';
import { Card, Group, Text, Progress } from '@mantine/core';
import { cn, formatDate } from '@/lib/utils';
import { ProjectStageIndicator } from '@/components/ui/ProjectStageIndicator';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import type { Project } from '@/types';

interface OverviewProps {
  project: Project;
}

const ICONS = {
  files: FolderOpen,
  rfis: FileSearch,
  submittals: AlertTriangle,
  issues: AlertTriangle,
};

function KPICard({ label, value, sub, icon: Icon, trend }: { label: string; value: number; sub: string; icon: typeof FolderOpen; trend?: { value: number; positive: boolean } }) {
  return (
    <Card radius="xl" withBorder shadow="sm" className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {value}
          </div>
          <div className="mt-1 text-body-sm text-text-secondary">{label}</div>
          <div className="mt-0.5 text-body-xs text-text-muted">{sub}</div>
          {trend && (
            <div className="mt-2 flex items-center gap-1.5 text-body-xs font-medium" style={{ color: trend.positive ? 'var(--color-success)' : 'var(--color-danger)' }}>
              <span>{trend.positive ? '▲' : '▼'} {Math.abs(trend.value)}%</span>
              <span className="text-text-muted">vs last week</span>
            </div>
          )}
        </div>
        <div className="shrink-0 p-2.5 rounded-lg bg-primary-light text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

function RecentActivity({ logs }: { logs: Project['dailyLogs'] }) {
  return (
    <Card radius="xl" withBorder shadow="sm" className="p-5">
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
        Recent activity
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {logs.slice(0, 3).map((log) => (
          <div key={log.date} className="flex items-start gap-3 border-b pb-3 text-body-sm last:border-0 last:pb-0" style={{ borderColor: 'var(--color-border-light)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{formatDate(log.date)}</span>
            <span style={{ color: 'var(--color-text-muted)' }}>{log.summary}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function NeedsAttention({ issues, rfis }: { issues: Project['issues']; rfis: Project['rfis'] }) {
  const openIssues = issues.filter((i) => i.status !== 'Closed');
  const openRfis = rfis.filter((r) => r.status === 'Open');

  return (
    <Card radius="xl" withBorder shadow="sm" className="p-5">
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
        Needs attention
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {openIssues.map((issue) => (
          <div key={issue.id} className="flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-2">
              <PriorityBadge level={issue.priority} />
              <span style={{ color: 'var(--color-text)' }}>{issue.title}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              {formatDate(issue.date)}
            </span>
          </div>
        ))}
        {openRfis.map((rfi) => (
          <div key={rfi.id} className="flex items-center justify-between text-body-sm">
            <span style={{ color: 'var(--color-text)' }}>{rfi.subject}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              Due {formatDate(rfi.due)}
            </span>
          </div>
        ))}
        {(openIssues.length === 0 && openRfis.length === 0) && (
          <div className="text-center py-4 text-text-muted">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-body-sm">All caught up!</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function Overview({ project }: OverviewProps) {
  const openIssues = project.issues.filter((i) => i.status !== 'Closed').length;
  const highPriorityIssues = project.issues.filter((i) => i.priority === 'High' && i.status !== 'Closed').length;
  const openRfis = project.rfis.filter((r) => r.status === 'Open').length;
  const pendingSubmittals = project.submittals.filter((s) => s.status === 'Pending' || s.status === 'Revise & Resubmit').length;

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-body-sm font-medium text-text-secondary">{project.location}</span>
            <ProjectStageIndicator stage={project.stage} vertical height={24} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            {project.name}
          </h1>
        </div>
        <div className="flex items-center gap-3 self-start">
          <ProjectStageIndicator stage={project.stage} height={6} />
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
            {project.stage} <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{project.percentComplete}%</span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KPICard
          label="Files under control"
          value={project.docs.length}
          sub={`${project.docs.filter((d) => d.status === 'review').length} in review`}
          icon={FolderOpen}
        />
        <KPICard
          label="Open RFIs"
          value={openRfis}
          sub={`${project.rfis.length} total`}
          icon={FileSearch}
        />
        <KPICard
          label="Pending submittals"
          value={pendingSubmittals}
          sub={`${project.submittals.length} total`}
          icon={AlertTriangle}
        />
        <KPICard
          label="Open issues"
          value={openIssues}
          sub={`${highPriorityIssues} high priority`}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity logs={project.dailyLogs} />
        <NeedsAttention issues={project.issues} rfis={project.rfis} />
      </div>
    </div>
  );
}