'use client';

import { useState } from 'react';
import { FileSearch, Plus, Filter, ChevronDown } from 'lucide-react';
import { Card, Group, Text, Button, TextInput, Select, Badge } from '@mantine/core';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import type { RFI, RFIStatus } from '@/types';

const STATUS_CONFIG: Record<RFIStatus, { label: string; color: string; bg: string }> = {
  Open: { label: 'Open', color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
  Answered: { label: 'Answered', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  Closed: { label: 'Closed', color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
};

interface RFITableProps {
  rfis: RFI[];
  onCreate?: () => void;
}

export function RFITable({ rfis, onCreate }: RFITableProps) {
  const [statusFilter, setStatusFilter] = useState<RFIStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = rfis.filter((r) => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchQuery = query.trim() === '' || 
      r.id.toLowerCase().includes(query.toLowerCase()) || 
      r.subject.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            RFIs
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Requests for information routed to consultants and the site team
          </p>
        </div>
        <Button onClick={onCreate} leftSection={<Plus className="h-4 w-4" />} size="sm">
          New RFI
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex gap-1">
          {(['All', 'Open', 'Answered', 'Closed'] as const).map((s) => {
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
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
            placeholder="Search RFI ID or subject"
            leftSection={<FileSearch className="h-4 w-4 text-text-muted" />}
            size="sm"
            radius="md"
            className="w-64"
          />
        </div>
      </div>

      <DataTable<RFI>
        columns={[
          { key: 'id', header: 'ID', width: '84px', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{r.id}</span> },
          { key: 'subject', header: 'Subject', width: '1fr' },
          { key: 'status', header: 'Status', width: '110px', render: (r) => <StatusBadge status={r.status} type="rfi" /> },
          { key: 'ballInCourt', header: 'Ball in court', width: '140px', render: (r) => <span style={{ color: 'var(--color-text-muted)' }}>{r.ballInCourt}</span> },
          { key: 'due', header: 'Due', width: '100px', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{formatDate(r.due)}</span> },
        ]}
        data={filtered}
        keyExtractor={(r) => r.id}
        emptyMessage="No RFIs match your filters"
        emptyIcon={<FileSearch className="h-10 w-10" />}
      />
    </div>
  );
}