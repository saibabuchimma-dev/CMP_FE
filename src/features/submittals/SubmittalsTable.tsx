'use client';

import { useState, useMemo } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Calendar, 
  Layers, 
  Tag, 
  Stamp,
  ArrowRight,
  Send,
  Building2
} from 'lucide-react';
import { Drawer, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import type { Submittal, SubmittalStatus } from '@/types';

interface SubmittalsTableProps {
  submittals: Submittal[];
  onCreate?: () => void;
}

export function SubmittalsTable({ submittals: initialSubmittals, onCreate }: SubmittalsTableProps) {
  const [submittalList, setSubmittalList] = useState<Submittal[]>(initialSubmittals);
  const [statusFilter, setStatusFilter] = useState<SubmittalStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const [selectedSubmittal, setSelectedSubmittal] = useState<Submittal | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSpec, setNewSpec] = useState('03 30 00');
  const [newDue, setNewDue] = useState('2026-09-20');
  const [newDescription, setNewDescription] = useState('');

  const filtered = useMemo(() => 
    submittalList.filter((s) => {
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchQuery = query.trim() === '' || 
        s.id.toLowerCase().includes(query.toLowerCase()) || 
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.spec.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchQuery;
    }), [statusFilter, query, submittalList]);

  const statuses = ['All', 'Pending', 'Approved', 'Approved as Noted', 'Revise & Resubmit'] as const;

  const handleCreateSubmittal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `SUB-${Math.floor(50 + Math.random() * 50)}`;
    const newSub: Submittal = {
      id: newId,
      title: newTitle.trim(),
      spec: newSpec.trim(),
      status: 'Pending',
      due: newDue,
      description: newDescription.trim() || 'Manufacturer product cut-sheet and compliance technical data.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setSubmittalList(prev => [newSub, ...prev]);

    notifications.show({
      title: 'Submittal Package Created',
      message: `${newSub.id} for Spec ${newSub.spec} logged for consultant review.`,
      color: 'blue',
    });

    setNewTitle('');
    setNewDescription('');
    setCreateModalOpen(false);
  };

  const handleUpdateStatus = (newStatus: SubmittalStatus) => {
    if (!selectedSubmittal) return;

    setSubmittalList(prev => prev.map(s => s.id === selectedSubmittal.id ? { ...s, status: newStatus } : s));
    setSelectedSubmittal(prev => prev ? { ...prev, status: newStatus } : null);

    notifications.show({
      title: 'Review Status Applied',
      message: `${selectedSubmittal.id} stamped as "${newStatus}".`,
      color: newStatus === 'Approved' ? 'green' : newStatus === 'Revise & Resubmit' ? 'red' : 'yellow',
    });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-warning bg-warning-bg uppercase tracking-wider mb-2">
            <ClipboardCheck className="h-3 w-3" />
            Material Submittals & Shop Drawings
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Procurement & Spec Approvals
          </h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            CSI MasterFormat technical cut-sheets, concrete mix designs, mockups, and facade shop drawings.
          </p>
        </div>
        <button
          onClick={() => (onCreate ? onCreate() : setCreateModalOpen(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-surface hover:bg-primary/90 font-medium text-body-sm transition-all shadow-sm active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Submittal</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          {statuses.map((s) => {
            const isActive = statusFilter === s;
            const count = s === 'All' 
              ? submittalList.length 
              : submittalList.filter(item => item.status === s).length;

            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 text-body-xs font-semibold rounded-xl transition-all shrink-0 p-2',
                  isActive
                    ? 'bg-primary text-surface shadow-xs'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                <span>{s}</span>
                <span className={cn('text-[11px] font-mono px-2 py-0.5 rounded-md font-bold', isActive ? 'bg-white/20' : 'bg-border-light text-text-muted')}>
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
      placeholder="Search spec code, submittal ID or title..."
      className="w-full rounded-xl border border-border bg-background py-2 pr-4 text-body-xs shadow-xs transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
      style={{ paddingLeft: '46px' }}
    />
  </div>
</div>

      </div>

      <DataTable<Submittal>
        columns={[
          { 
            key: 'id', 
            header: 'Package No.', 
            width: '110px', 
            render: (s) => (
              <span className="font-mono text-body-xs font-bold text-primary hover:underline">
                {s.id}
              </span>
            ) 
          },
          { 
            key: 'title', 
            header: 'Title & Material Description', 
            width: '1fr',
            render: (s) => (
              <div>
                <span className="font-medium text-text text-body-sm block">{s.title}</span>
                <span className="text-[11px] text-text-muted">CSI Section: {s.spec}</span>
              </div>
            )
          },
          { 
            key: 'spec', 
            header: 'Spec Code', 
            width: '120px', 
            render: (s) => (
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-background border border-border">
                {s.spec}
              </span>
            ) 
          },
          { 
            key: 'status', 
            header: 'Review Stamp', 
            width: '170px', 
            render: (s) => <StatusBadge status={s.status} type="submittal" /> 
          },
          { 
            key: 'due', 
            header: 'Required On Site', 
            width: '130px', 
            render: (s) => <span className="font-mono text-body-xs text-text-muted">{formatDate(s.due)}</span> 
          },
        ]}
        data={filtered}
        keyExtractor={(s) => s.id}
        onRowClick={(sub) => setSelectedSubmittal(sub)}
        emptyMessage="No submittals match your filter"
        emptyIcon={<ClipboardCheck className="h-10 w-10 text-text-muted/40" />}
      />

      <Drawer
        opened={!!selectedSubmittal}
        onClose={() => setSelectedSubmittal(null)}
        position="right"
        size="md"
        title={
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-primary">{selectedSubmittal?.id}</span>
            <span className="text-text-muted">·</span>
            <span className="font-heading font-semibold text-text truncate">Submittal Review Package</span>
          </div>
        }
      >
        {selectedSubmittal && (
          <div className="space-y-6 pt-2 pb-8">
            <div className="p-5 sm:p-6 rounded-2xl bg-background border border-border space-y-3.5">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedSubmittal.status} type="submittal" />
                <span className="font-mono text-body-xs text-text-muted">Due: {formatDate(selectedSubmittal.due)}</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-text leading-snug">
                {selectedSubmittal.title}
              </h3>
              <div className="flex items-center gap-2 text-body-xs text-text-secondary">
                <Tag className="h-3.5 w-3.5 text-text-muted" />
                <span>CSI MasterFormat Code: <strong className="font-mono">{selectedSubmittal.spec}</strong></span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border-2 border-dashed border-border bg-surface text-center space-y-3 shadow-xs">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-light text-primary mx-auto">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-text">
                ENGINEERING REVIEW STAMP
              </div>
              <div className="text-body-xs text-text-muted max-w-xs mx-auto">
                Current status: <strong>{selectedSubmittal.status}</strong>. Contractor may proceed according to approved notations.
              </div>
              <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handleUpdateStatus('Approved')}
                  className="px-3.5 py-1.5 text-body-xs font-semibold rounded-lg bg-success-bg text-success hover:bg-success hover:text-white transition-colors shadow-xs"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus('Approved as Noted')}
                  className="px-3.5 py-1.5 text-body-xs font-semibold rounded-lg bg-warning-bg text-warning hover:bg-warning hover:text-white transition-colors shadow-xs"
                >
                  Approve as Noted
                </button>
                <button
                  onClick={() => handleUpdateStatus('Revise & Resubmit')}
                  className="px-3.5 py-1.5 text-body-xs font-semibold rounded-lg bg-danger-bg text-danger hover:bg-danger hover:text-white transition-colors shadow-xs"
                >
                  Revise & Resubmit
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-body-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">
                Submittal Details & Notes
              </h4>
              <div className="p-5 rounded-2xl border border-border bg-surface text-body-sm text-text leading-relaxed shadow-xs">
                {selectedSubmittal.description || 'Manufacturer laboratory test certificates, compliance guarantees, and technical cut-sheet documentation submitted for structural engineer verification.'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border-light text-body-xs flex items-center justify-between">
              <div>
                <span className="text-text-muted block text-[11px]">Division Reference</span>
                <span className="font-mono font-semibold text-text">{selectedSubmittal.spec}</span>
              </div>
              <span className="text-text-secondary">Lead Time: 14 Days</span>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedSubmittal(null)}
                className="px-4 py-2 rounded-lg border border-border text-body-sm font-medium hover:bg-background transition-colors"
              >
                Close Package
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={<span className="font-heading font-semibold text-lg text-text">Register Submittal Package</span>}
        radius="lg"
        centered
        size="md"
      >
        <form onSubmit={handleCreateSubmittal} className="space-y-4 pt-2">
          <div>
            <label className="block text-body-xs font-medium text-text-secondary mb-1">
              Submittal Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Fire-Rated Door Cut Sheets & Hardware Schedule"
              className="w-full px-3 py-2 text-body-sm rounded-lg border border-border focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-body-xs font-medium text-text-secondary mb-1">
                CSI Spec Section *
              </label>
              <input
                type="text"
                required
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="e.g. 08 11 00"
                className="w-full px-3 py-2 text-body-sm rounded-lg border border-border focus:border-primary focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-body-xs font-medium text-text-secondary mb-1">
                Required On-Site Date
              </label>
              <input
                type="date"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="w-full px-3 py-2 text-body-sm rounded-lg border border-border focus:border-primary focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-xs font-medium text-text-secondary mb-1">
              Package Scope & Manufacturer Details
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="List manufacturer model, test standards (ASTM/IS), and sample quantities..."
              className="w-full px-3 py-2 text-body-sm rounded-lg border border-border focus:border-primary focus:outline-none leading-relaxed"
            />
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-body-sm rounded-lg border border-border hover:bg-background text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-body-sm rounded-lg bg-primary text-surface hover:bg-primary/90 font-medium transition-colors"
            >
              Create Submittal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}