'use client';

import { useState, useMemo } from 'react';
import {
  Upload,
  Search,
  Layers,
  ClipboardCheck,
  FileText,
  FolderOpen,
  ChevronRight,
  CheckCircle2,
  Clock,
  PauseCircle,
  XCircle,
  Download,
  Eye,
  FileCheck,
  Plus,
  X,
  FileCode,
  Tag,
} from 'lucide-react';
import { Modal, Drawer } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { DOCUMENT_CATEGORIES, DOCUMENT_STATUS_CONFIG } from '@/constants';
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
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ color: config.color, background: config.bg, border: `1px solid ${config.color}30` }}
    >
      <Icon className="h-3 w-3" strokeWidth={2.25} />
      {config.label}
    </span>
  );
}

interface FilesTableProps {
  documents: Document[];
  onUpload?: () => void;
}

export function FilesTable({ documents: initialDocuments, onUpload }: FilesTableProps) {
  const [docList, setDocList] = useState<Document[]>(initialDocuments);
  const [activeCat, setActiveCat] = useState<DocumentCategory | 'All'>('All');
  const [query, setQuery] = useState('');

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [newNo, setNewNo] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<DocumentCategory>('Drawings');
  const [newRev, setNewRev] = useState('A');
  const [newAuthor, setNewAuthor] = useState('');

  const filtered = useMemo(
    () =>
      docList.filter((d) => {
        const matchCat = activeCat === 'All' || d.cat === activeCat;
        const matchQuery =
          query.trim() === '' ||
          d.no.toLowerCase().includes(query.toLowerCase()) ||
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.by.toLowerCase().includes(query.toLowerCase());
        return matchCat && matchQuery;
      }),
    [activeCat, query, docList]
  );

  const tabs = ['All', ...DOCUMENT_CATEGORIES.filter((c) => c !== 'All')] as const;

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNo.trim() || !newTitle.trim()) return;

    const newDoc: Document = {
      no: newNo.trim().toUpperCase(),
      title: newTitle.trim(),
      rev: newRev.trim().toUpperCase() || 'A',
      cat: newCat,
      status: 'review',
      by: newAuthor.trim() || 'Site Engineer',
      date: new Date().toISOString().split('T')[0],
    };

    setDocList((prev) => [newDoc, ...prev]);

    notifications.show({
      title: 'Drawing Registered',
      message: `${newDoc.no} logged and queued for QA/QC review.`,
      color: 'green',
    });

    setNewNo('');
    setNewTitle('');
    setNewRev('A');
    setNewAuthor('');
    setUploadModalOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-primary-light px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <FolderOpen className="h-3 w-3" />
            Document Control & Drawings
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Project Drawings & Specifications
          </h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            Issued-For-Construction (IFC) drawings, QA/QC records, structural schedules, and
            contractual specifications.
          </p>
        </div>
        <button
          onClick={() => (onUpload ? onUpload() : setUploadModalOpen(true))}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-body-sm font-medium text-surface shadow-sm transition-all hover:bg-primary/90 active:scale-95 md:self-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="shadow-xs flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-3 sm:flex-row sm:p-5">
        <div className="scrollbar-thin flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
          {tabs.map((t) => {
            const Icon = t === 'All' ? FolderOpen : CATEGORY_ICONS[t as DocumentCategory];
            const isActive = activeCat === t;
            const count = t === 'All' ? docList.length : docList.filter((d) => d.cat === t).length;

            return (
              <button
                key={t}
                onClick={() => setActiveCat(t as any)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl p-2 px-3.5 py-2 text-body-xs font-semibold transition-all',
                  isActive
                    ? 'shadow-xs bg-primary text-surface'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{t}</span>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-[11px] font-bold',
                    isActive ? 'bg-white/20' : 'bg-border-light text-text-muted'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-80">
          <div className="relative w-full">
            <Search
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              style={{ left: '14px' }}
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sheet no, title or engineer..."
              className="shadow-xs w-full rounded-xl border border-border bg-background py-2 pr-4 text-body-xs transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
              style={{ paddingLeft: '46px' }}
            />
          </div>
        </div>
      </div>

      <DataTable<Document>
        columns={[
          {
            key: 'no',
            header: 'Sheet / Doc No.',
            width: '140px',
            render: (d) => (
              <span className="flex items-center gap-1.5 font-mono text-body-xs font-semibold text-primary hover:underline">
                <FileCode className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                {d.no}
              </span>
            ),
          },
          {
            key: 'title',
            header: 'Title / Description',
            width: '1fr',
            render: (d) => (
              <div>
                <span className="block text-body-sm font-medium text-text">{d.title}</span>
                <span className="text-[11px] text-text-muted">{d.cat}</span>
              </div>
            ),
          },
          {
            key: 'rev',
            header: 'Rev',
            width: '70px',
            render: (d) => (
              <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] font-bold">
                {d.rev}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            width: '140px',
            render: (d) => <DocStatusPill status={d.status} />,
          },
          {
            key: 'by',
            header: 'Responsible',
            width: '130px',
            render: (d) => <span className="text-body-xs text-text-secondary">{d.by}</span>,
          },
          {
            key: 'date',
            header: 'Issued Date',
            width: '110px',
            render: (d) => (
              <span className="font-mono text-body-xs text-text-muted">{formatDate(d.date)}</span>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(d, i) => `${d.no}-${i}`}
        onRowClick={(doc) => setSelectedDoc(doc)}
        emptyMessage="No documents match your filter"
        emptyIcon={<FolderOpen className="h-10 w-10 text-text-muted/40" />}
      />

      <Modal
        opened={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-primary" />
            <span className="font-heading text-lg font-semibold text-text">
              Document Specification
            </span>
          </div>
        }
        size="lg"
        radius="lg"
        centered
      >
        {selectedDoc && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background p-5 sm:p-6">
              <div>
                <span className="font-mono text-xs font-bold text-primary">{selectedDoc.no}</span>
                <h3 className="mt-0.5 font-heading text-lg font-bold text-text">
                  {selectedDoc.title}
                </h3>
                <p className="mt-0.5 text-body-xs text-text-muted">
                  Discipline: {selectedDoc.cat} · Author: {selectedDoc.by}
                </p>
              </div>
              <DocStatusPill status={selectedDoc.status} />
            </div>

            <div className="relative flex min-h-[230px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-primary/5 p-8 text-center sm:p-10">
              <div className="mb-3.5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers className="h-8 w-8" />
              </div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-text">
                {selectedDoc.no} — REV {selectedDoc.rev}
              </div>
              <div className="mt-1 max-w-sm text-[11px] text-text-muted">
                Scale: 1:100 @ A1 · Issued for Construction · Coordinate Grid Reference: Level 9-14
              </div>
              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => {
                    notifications.show({
                      title: 'Download Initiated',
                      message: `Downloading ${selectedDoc.no}-REV-${selectedDoc.rev}.pdf`,
                      color: 'blue',
                    });
                  }}
                  className="shadow-xs inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-body-xs font-semibold text-text transition-colors hover:bg-background"
                >
                  <Download className="h-4 w-4 text-primary" />
                  <span>Download PDF Sheet</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-body-xs font-semibold uppercase tracking-wider text-text-muted">
                Revision & Approval History
              </h4>
              <div className="ml-1 space-y-2 border-l-2 border-primary/30 pl-3 text-body-xs">
                <div className="relative pb-2">
                  <div className="font-medium text-text">Revision {selectedDoc.rev} (Current)</div>
                  <div className="text-[11px] text-text-muted">
                    Issued on {formatDate(selectedDoc.date)} by {selectedDoc.by}
                  </div>
                </div>
                <div className="relative text-text-muted">
                  <div className="font-medium">Revision A (Initial IFC Submission)</div>
                  <div className="text-[11px]">
                    Issued on 2026-06-01 · Architectural consultant check complete
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-4">
              <button
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-body-sm font-medium transition-colors hover:bg-background"
              >
                Close Viewer
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={
          <span className="font-heading text-lg font-semibold text-text">
            Upload Drawing or Specification
          </span>
        }
        radius="lg"
        centered
      >
        <form onSubmit={handleCreateDoc} className="space-y-4 pt-2">
          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Document / Sheet Number *
            </label>
            <input
              type="text"
              required
              value={newNo}
              onChange={(e) => setNewNo(e.target.value)}
              placeholder="e.g. STR-GA-015 or MEP-HVAC-008"
              className="w-full rounded-lg border border-border px-3 py-2 font-mono text-body-sm uppercase focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Typical Floor Slab Reinforcement Details"
              className="w-full rounded-lg border border-border px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-body-xs font-medium text-text-secondary">
                Discipline Category
              </label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as DocumentCategory)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
              >
                <option value="Drawings">Drawings (IFC)</option>
                <option value="QA/QC">QA/QC Records</option>
                <option value="Contracts">Contracts</option>
                <option value="Progress Reports">Progress Reports</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-body-xs font-medium text-text-secondary">
                Revision Tag
              </label>
              <input
                type="text"
                value={newRev}
                onChange={(e) => setNewRev(e.target.value)}
                placeholder="A, B, C or 0"
                className="w-full rounded-lg border border-border px-3 py-2 font-mono text-body-sm uppercase focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Author / Consulting Firm
            </label>
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="e.g. R. Iyer or Ekaa Studio"
              className="w-full rounded-lg border border-border px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="rounded-lg border border-dashed border-border bg-background p-3 text-center text-body-xs text-text-muted">
            <Upload className="mx-auto mb-1 h-5 w-5 text-text-muted/60" />
            <span>Click to browse PDF/DWG files or drag & drop</span>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-body-sm text-text transition-colors hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-body-sm font-medium text-surface transition-colors hover:bg-primary/90"
            >
              Register Document
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
