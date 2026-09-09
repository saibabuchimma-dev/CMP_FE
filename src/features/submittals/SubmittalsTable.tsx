'use client';

import { useState } from 'react';
import { ClipboardCheck, Plus, Filter, ChevronDown } from 'lucide-react';
import { Card, Group, Text, Button, TextInput, Select, Badge } from '@mantine/core';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import type { Submittal, SubmittalStatus } from '@/types';

const STATUS_CONFIG: Record<SubmittalStatus, { label: string; color: string; bg: string }> = {
  Pending: { label: 'Pending', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  Approved: { label: 'Approved', color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  'Approved as Noted': { label: 'Approved as Noted', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  'Revise & Resubmit': { label: 'Revise & Resubmit', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' },
};

interface SubmittalsTableProps {
  submittals: Submittal[];
  onCreate?: () => void;
}

export function SubmittalsTable({ submittals, onCreate }: SubmittalsTableProps) {
  const [statusFilter, setStatusFilter] = useState<SubmittalStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = submittals.filter((s) => {
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchQuery = query.trim() === '' || 
      s.id.toLowerCase().includes(query.toLowerCase()) || 
      s.title.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  const statuses = ['All', 'Pending', 'Approved', 'Approved as Noted', 'Revise & Resubmit'] as const;

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            Submittals
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Material and shop-drawing submittals against spec sections
          </p>
        </div>
        <Button onClick={onCreate} leftSection={<Plus className="h-4 w-4" />} size="sm">
          New Submittal
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex gap-1">
          {statuses.map((s) => {
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
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
            placeholder="Search submittal ID or title"
            leftSection={<ClipboardCheck className="h-4 w-4 text-text-muted" />}
            size="sm"
            radius="md"
            className="w-64"
          />
        </div>
      </div>

      <DataTable<Submittal>
        columns={[
          { key: 'id', header: 'ID', width: '84px', render: (s) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{s.id}</span> },
          { key: 'title', header: 'Title', width: '1fr' },
          { key: 'spec', header: 'Spec', width: '100px', render: (s) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{s.spec}</span> },
          { key: 'status', header: 'Status', width: '150px', render: (s) => <StatusBadge status={s.status} type="submittal" /> },
          { key: 'due', header: 'Due', width: '100px', render: (s) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{formatDate(s.due)}</span> },
        ]}
        data={filtered}
        keyExtractor={(s) => s.id}
        emptyMessage="No submittals match your filters"
        emptyIcon={<ClipboardCheck className="h-10 w-10" />}
      />
    </div>
  );
}