'use client';

import { BarChart3 } from 'lucide-react';
import { Card, Group, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { DOCUMENT_STATUS_CONFIG } from '@/constants';
import type { Project } from '@/types';

interface InsightsChartsProps {
  project: Project;
}

const CHART_COLORS = [
  'var(--color-primary)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-danger)',
  'var(--color-info)',
];

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <Card radius="xl" withBorder shadow="sm" className={cn('p-5', className)}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem' }}>
        {title}
      </h3>
      <div style={{ height: 280 }}>{children}</div>
    </Card>
  );
}

function FilesByStatusChart({ project }: { project: Project }) {
  const docStatusData = Object.entries(DOCUMENT_STATUS_CONFIG).map(([key, config]) => ({
    name: config.label,
    count: project.docs.filter((d) => d.status === key).length,
    color: config.color,
  })).filter(d => d.count > 0);

  if (docStatusData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        No document data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={docStatusData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
        <XAxis 
          type="number" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          axisLine={{ stroke: 'var(--color-border)' }} 
          tickLine={false}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          axisLine={false} 
          tickLine={false}
          width={100}
        />
        <Tooltip 
          cursor={{ fill: 'var(--color-background)' }} 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 8,
          }}
          formatter={(value: number) => [value, 'files']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {docStatusData.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function IssuesByTypeChart({ project }: { project: Project }) {
  const issueTypes = ['Safety', 'Quality', 'Design'] as const;
  const issueTypeData = issueTypes.map((type, i) => ({
    name: type,
    count: project.issues.filter((i) => i.type === type).length,
    color: CHART_COLORS[i],
  })).filter(d => d.count > 0);

  if (issueTypeData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted">
        No issue data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={issueTypeData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
        <XAxis 
          type="number" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          axisLine={{ stroke: 'var(--color-border)' }} 
          tickLine={false}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          axisLine={false} 
          tickLine={false}
          width={100}
        />
        <Tooltip 
          cursor={{ fill: 'var(--color-background)' }} 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 8,
          }}
          formatter={(value: number) => [value, 'issues']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {issueTypeData.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ProjectProgressChart({ project }: { project: Project }) {
  const stages = ['Foundation', 'Superstructure', 'Finishing', 'Handover'] as const;
  const stageData = stages.map((stage, i) => ({
    name: stage,
    complete: project.stage === stage ? project.percentComplete : (i < stages.indexOf(project.stage) ? 100 : 0),
    isCurrent: project.stage === stage,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={stageData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
        <XAxis 
          type="number" 
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          axisLine={{ stroke: 'var(--color-border)' }} 
          tickLine={false}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          axisLine={false} 
          tickLine={false}
          width={100}
        />
        <Tooltip 
          cursor={{ fill: 'var(--color-background)' }} 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 8,
          }}
          formatter={(value: number) => [`${value}%`, 'complete']}
        />
        <Bar dataKey="complete" radius={[0, 4, 4, 0]}>
          {stageData.map((d, i) => <Cell key={i} fill={d.isCurrent ? 'var(--color-primary)' : 'var(--color-border-light)'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function InsightsCharts({ project }: InsightsChartsProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            Insights
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Document and issue trends for this project
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <ChartCard title="Files by status">
          <FilesByStatusChart project={project} />
        </ChartCard>
        <ChartCard title="Issues by type">
          <IssuesByTypeChart project={project} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Project progress by stage">
          <ProjectProgressChart project={project} />
        </ChartCard>
        <ChartCard title="Upcoming charts">
          <div className="flex flex-col items-center justify-center h-full text-text-muted gap-3">
            <BarChart3 className="h-12 w-12" style={{ opacity: 0.3 }} />
            <div className="text-center">
              <p className="text-body-md font-medium">More charts coming soon</p>
              <p className="text-body-sm">RFI turnaround · Issue resolution · Submittal performance · Manpower trends</p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}