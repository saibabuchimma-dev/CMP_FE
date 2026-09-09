'use client';

import { useState } from 'react';
import { AlertTriangle, Plus, Filter, ChevronDown } from 'lucide-react';
import { Card, Group, Text, Button, TextInput, Select, Badge } from '@mantine/core';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import type { Issue, IssueType, IssuePriority, IssueStatus } from '@/types';

const TYPE_COLORS: Record<IssueType, string> = {
  Safety: 'var(--color-danger)',
  Quality: 'var(--color-warning)',
  Design: 'var(--color-info)',
};

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  High: 'var(--color-danger)',
  Medium: 'var(--color-warning)',
  Low: 'var(--color-text-muted)',
};

interface IssuesTableProps {
  issues: Issue[];
  onCreate?: () => void;
}

export function IssuesTable({ issues, onCreate }: IssuesTableProps) {
  const [typeFilter, setTypeFilter] = useState<IssueType | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = issues.filter((i) => {
    const matchType = typeFilter === 'All' || i.type === typeFilter;
    const matchPriority = priorityFilter === 'All' || i.priority === priorityFilter;
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchQuery = query.trim() === '' || 
      i.id.toLowerCase().includes(query.toLowerCase()) || 
      i.title.toLowerCase().includes(query.toLowerCase());
    return matchType && matchPriority && matchStatus && matchQuery;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            Issues
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Field issues logged against safety, quality and design
          </p>
        </div>
        <Button onClick={onCreate} leftSection={<Plus className="h-4 w-4" />} size="sm">
          New Issue
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex gap-1 flex-wrap">
          {(['All', 'Safety', 'Quality', 'Design'] as const).map((t) => {
            const isActive = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t as any)}
                className={cn(
                  'px-3 py-1.5 text-body-sm rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-surface'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                {t}
              </button>
            );
          })}
          {(['All', 'High', 'Medium', 'Low'] as const).map((p) => {
            const isActive = priorityFilter === p;
            const color = PRIORITY_COLORS[p as IssuePriority];
            return (
              <button
                key={`priority-${p}`}
                onClick={() => setPriorityFilter(p as any)}
                className={cn(
                  'px-3 py-1.5 text-body-sm rounded-lg transition-all duration-200',
                  isActive
                    ? `text-surface`
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
                style={isActive ? { backgroundColor: color } : {}}
              >
                {p}
              </button>
            );
          })}
          {(['All', 'Open', 'In Progress', 'Closed'] as const).map((s) => {
            const isActive = statusFilter === s;
            return (
              <button
                key={`status-${s}`}
                onClick={() => setStatusFilter(s as any)}
                className={cn(
                  'px-3 py-1.5 text-body-sm rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-surface'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search issue ID or title"
            leftSection={<AlertTriangle className="h-4 w-4 text-text-muted" />}
            size="sm"
            radius="md"
            className="w-64"
          />
        </div>
      </div>

      <DataTable<Issue>
        columns={[
          { key: 'id', header: 'ID', width: '84px', render: (i) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{i.id}</span> },
          { key: 'title', header: 'Title', width: '1fr' },
          { key: 'type', header: 'Type', width: '90px', render: (i) => (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium rounded-xs" style={{ color: TYPE_COLORS[i.type], background: `${TYPE_COLORS[i.type]}15`, borderColor: `${TYPE_COLORS[i.type]}40` }}>
              {i.type}
            </span>
          )},
          { key: 'priority', header: 'Priority', width: '90px', render: (i) => <PriorityBadge level={i.priority} /> },
          { key: 'status', header: 'Status', width: '110px', render: (i) => <StatusBadge status={i.status} type="issue" /> },
          { key: 'location', header: 'Location', width: '130px', render: (i) => <span style={{ color: 'var(--color-text-muted)' }}>{i.location}</span> },
          { key: 'date', header: 'Date', width: '100px', render: (i) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{formatDate(i.date)}</span> },
        ]}
        data={filtered}
        keyExtractor={(i) => i.id}
        emptyMessage="No issues match your filters"
        emptyIcon={<AlertTriangle className="h-10 w-10" />}
      />
    </div>
  );
}