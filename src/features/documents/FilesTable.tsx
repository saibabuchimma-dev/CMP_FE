'use client';

import { useState, useMemo } from 'react';
import { Upload, Search, Layers, ClipboardCheck, FileText, FolderOpen, ChevronDown } from 'lucide-react';
import { Card, Group, Text, Button, TextInput, Select } from '@mantine/core';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import { PROJECT_NAVIGATION } from '@/constants';
import { DOCUMENT_CATEGORIES, DOCUMENT_CATEGORY_ICONS, DOCUMENT_STATUS_CONFIG } from '@/constants';
import type { Document, DocumentCategory, DocumentStatus } from '@/types';

const CATEGORY_ICONS: Record<DocumentCategory, typeof Layers> = {
  Drawings: Layers,
  'QA/QC': ClipboardCheck,
  Contracts: FileText,
  'Progress Reports': FolderOpen,
};

const STATUS_ICONS: Record<DocumentStatus, typeof CheckCircle2> = {
  approved: CheckCircle2,
  review: Clock,
  hold: PauseCircle,
  rejected: XCircle,
};

function DocStatusPill({ status }: { status: DocumentStatus }) {
  const config = DOCUMENT_STATUS_CONFIG[status];
  const Icon = STATUS_ICONS[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[3px] px-2 py-1 text-[12px] font-medium" style={{ color: config.color, background: config.bg }}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      {config.label}
    </span>
  );
}

interface FilesTableProps {
  documents: Document[];
  onUpload?: () => void;
}

export function FilesTable({ documents, onUpload }: FilesTableProps) {
  const [activeCat, setActiveCat] = useState<DocumentCategory | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => 
    documents.filter((d) => {
      const matchCat = activeCat === 'All' || d.cat === activeCat;
      const matchQuery = query.trim() === '' || 
        d.no.toLowerCase().includes(query.toLowerCase()) || 
        d.title.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    }), [activeCat, query, documents]);

  const tabs = ['All', ...DOCUMENT_CATEGORIES.filter(c => c !== 'All')] as const;

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
            Files
          </h1>
          <p className="mt-1.5 text-body-sm" style={{ color: 'var(--color-text-muted)' }}>
            Drawings, QA/QC records, contracts and reports for this project
          </p>
        </div>
        <Button onClick={onUpload} leftSection={<Upload className="h-4 w-4" />} size="sm">
          Upload
        </Button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 border-b pb-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex gap-1">
          {tabs.map((t) => {
            const Icon = CATEGORY_ICONS[t as DocumentCategory];
            const isActive = activeCat === t;
            return (
              <button
                key={t}
                onClick={() => setActiveCat(t as any)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-body-sm rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-surface'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                <Icon className="h-4 w-4" />
                {t}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search doc no. or title"
            leftSection={<Search className="h-4 w-4 text-text-muted" />}
            size="sm"
            radius="md"
            className="w-64"
          />
        </div>
      </div>

      <DataTable<Document>
        columns={[
          { key: 'no', header: 'Doc no.', width: '120px', render: (d) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{d.no}</span> },
          { key: 'title', header: 'Title', width: '1fr' },
          { key: 'rev', header: 'Rev', width: '56px', render: (d) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{d.rev}</span> },
          { key: 'status', header: 'Status', width: '130px', render: (d) => <DocStatusPill status={d.status} /> },
          { key: 'by', header: 'Owner', width: '120px', render: (d) => <span style={{ color: 'var(--color-text-muted)' }}>{d.by}</span> },
          { key: 'date', header: 'Date', width: '110px', render: (d) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{formatDate(d.date)}</span> },
        ]}
        data={filtered}
        keyExtractor={(d, i) => `${d.no}-${i}`}
        emptyMessage="No documents match your filters"
        emptyIcon={<FolderOpen className="h-10 w-10" />}
      />
    </div>
  );
}