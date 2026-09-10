'use client';

import { useState, useMemo } from 'react';
import {
  FileSearch,
  Plus,
  Search,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Calendar,
  ArrowRight,
  Send,
  MessageSquare,
  Building2,
  FileCheck,
} from 'lucide-react';
import { Drawer, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/Badge';
import type { RFI, RFIStatus } from '@/types';

interface RFITableProps {
  rfis: RFI[];
  onCreate?: () => void;
}

export function RFITable({ rfis: initialRfis, onCreate }: RFITableProps) {
  const [rfiList, setRfiList] = useState<RFI[]>(initialRfis);
  const [statusFilter, setStatusFilter] = useState<RFIStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const [selectedRfi, setSelectedRfi] = useState<RFI | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('Ekaa Studio (Architect)');
  const [newBallInCourt, setNewBallInCourt] = useState('Consultant');
  const [newDue, setNewDue] = useState('2026-09-18');
  const [newDescription, setNewDescription] = useState('');

  const [responseText, setResponseText] = useState('');

  const filtered = useMemo(
    () =>
      rfiList.filter((r) => {
        const matchStatus = statusFilter === 'All' || r.status === statusFilter;
        const matchQuery =
          query.trim() === '' ||
          r.id.toLowerCase().includes(query.toLowerCase()) ||
          r.subject.toLowerCase().includes(query.toLowerCase()) ||
          r.assignedTo.toLowerCase().includes(query.toLowerCase()) ||
          r.ballInCourt.toLowerCase().includes(query.toLowerCase());
        return matchStatus && matchQuery;
      }),
    [statusFilter, query, rfiList]
  );

  const openCount = rfiList.filter((r) => r.status === 'Open').length;
  const answeredCount = rfiList.filter((r) => r.status === 'Answered').length;
  const closedCount = rfiList.filter((r) => r.status === 'Closed').length;

  const handleCreateRFI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const newId = `RFI-${Math.floor(120 + Math.random() * 80)}`;
    const newRfi: RFI = {
      id: newId,
      subject: newSubject.trim(),
      status: 'Open',
      assignedTo: newAssignedTo,
      ballInCourt: newBallInCourt,
      due: newDue,
      description:
        newDescription.trim() || 'Clarification requested regarding structural drawing clash.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setRfiList((prev) => [newRfi, ...prev]);

    notifications.show({
      title: 'RFI Logged',
      message: `${newRfi.id}: "${newRfi.subject}" assigned to ${newRfi.ballInCourt}.`,
      color: 'blue',
    });

    setNewSubject('');
    setNewDescription('');
    setCreateModalOpen(false);
  };

  const handleUpdateStatus = (newStatus: RFIStatus) => {
    if (!selectedRfi) return;

    setRfiList((prev) =>
      prev.map((r) =>
        r.id === selectedRfi.id
          ? {
              ...r,
              status: newStatus,
              ballInCourt:
                newStatus === 'Closed'
                  ? '—'
                  : newStatus === 'Answered'
                    ? 'Site Team'
                    : 'Consultant',
            }
          : r
      )
    );

    setSelectedRfi((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            ballInCourt:
              newStatus === 'Closed' ? '—' : newStatus === 'Answered' ? 'Site Team' : 'Consultant',
          }
        : null
    );

    notifications.show({
      title: 'RFI Updated',
      message: `${selectedRfi.id} marked as ${newStatus}.`,
      color: newStatus === 'Closed' ? 'green' : 'blue',
    });
  };

  const handleSendResponse = () => {
    if (!responseText.trim() || !selectedRfi) return;

    handleUpdateStatus('Answered');
    setResponseText('');

    notifications.show({
      title: 'Official Response Recorded',
      message: `Consultant answer appended to ${selectedRfi.id}. Ball in court moved to Site Team.`,
      color: 'green',
    });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-info-bg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-info">
            <FileSearch className="h-3 w-3" />
            Requests for Information (RFI)
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Design & Site Technical Queries
          </h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            Formal engineering inquiries routed between site supervisors, structural consultants,
            and architects with SLA tracking.
          </p>
        </div>
        <button
          onClick={() => (onCreate ? onCreate() : setCreateModalOpen(true))}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-body-sm font-medium text-surface shadow-sm transition-all hover:bg-primary/90 active:scale-95 md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New RFI</span>
        </button>
      </div>

      <div className="shadow-xs flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-2 p-4 sm:flex-row sm:p-5">
        <div className="scrollbar-thin flex w-full items-center gap-2.5 overflow-x-auto p-1 pb-1 sm:w-auto sm:pb-0">
          {[
            { label: 'All', count: rfiList.length },
            { label: 'Open', count: openCount },
            { label: 'Answered', count: answeredCount },
            { label: 'Closed', count: closedCount },
          ].map((tab) => {
            const isActive = statusFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.label as any)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-xl p-2 px-3.5 py-2 text-body-xs font-semibold transition-all',
                  isActive
                    ? 'shadow-xs bg-primary text-surface'
                    : 'text-text-secondary hover:bg-background hover:text-text'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 font-mono text-[11px] font-bold',
                    isActive ? 'bg-white/20' : 'bg-border-light text-text-muted'
                  )}
                >
                  {tab.count}
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
              placeholder="Search RFI ID, subject or consultant..."
              className="shadow-xs w-full rounded-xl border border-border bg-background py-2 pr-4 text-body-xs transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
              style={{ paddingLeft: '46px' }}
            />
          </div>
        </div>
      </div>

      <DataTable<RFI>
        columns={[
          {
            key: 'id',
            header: 'RFI No.',
            width: '100px',
            render: (r) => (
              <span className="font-mono text-body-xs font-bold text-primary hover:underline">
                {r.id}
              </span>
            ),
          },
          {
            key: 'subject',
            header: 'Subject & Clarification Query',
            width: '1fr',
            render: (r) => (
              <div>
                <span className="block text-body-sm font-medium text-text">{r.subject}</span>
                <span className="text-[11px] text-text-muted">Assigned: {r.assignedTo}</span>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (r) => <StatusBadge status={r.status} type="rfi" />,
          },
          {
            key: 'ballInCourt',
            header: 'Ball in Court',
            width: '160px',
            render: (r) => (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-body-xs font-medium',
                  r.ballInCourt.toLowerCase().includes('consultant')
                    ? 'border border-info/20 bg-info-bg text-info'
                    : r.ballInCourt === '—'
                      ? 'text-text-muted'
                      : 'border border-warning/20 bg-warning-bg text-warning'
                )}
              >
                <UserCheck className="h-3 w-3" />
                {r.ballInCourt}
              </span>
            ),
          },
          {
            key: 'due',
            header: 'SLA Due Date',
            width: '130px',
            render: (r) => {
              const isOverdue = new Date(r.due) < new Date() && r.status !== 'Closed';
              return (
                <div className="font-mono text-body-xs">
                  <span className={cn(isOverdue ? 'font-semibold text-danger' : 'text-text-muted')}>
                    {formatDate(r.due)}
                  </span>
                  {isOverdue && (
                    <span className="block font-sans text-[10px] text-danger">Overdue SLA</span>
                  )}
                </div>
              );
            },
          },
        ]}
        data={filtered}
        keyExtractor={(r) => r.id}
        onRowClick={(rfi) => setSelectedRfi(rfi)}
        emptyMessage="No RFIs match your search criteria"
        emptyIcon={<FileSearch className="h-10 w-10 text-text-muted/40" />}
      />

      <Drawer
        opened={!!selectedRfi}
        onClose={() => setSelectedRfi(null)}
        position="right"
        size="md"
        title={
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-primary">{selectedRfi?.id}</span>
            <span className="text-text-muted">·</span>
            <span className="truncate font-heading font-semibold text-text">RFI Review Thread</span>
          </div>
        }
      >
        {selectedRfi && (
          <div className="space-y-6 pb-8 pt-2">
            <div className="space-y-3.5 rounded-2xl border border-border bg-background p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedRfi.status} type="rfi" />
                <span className="font-mono text-body-xs text-text-muted">
                  Due: {formatDate(selectedRfi.due)}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold leading-snug text-text">
                {selectedRfi.subject}
              </h3>
              <div className="flex items-center gap-2 text-body-xs text-text-secondary">
                <Building2 className="h-3.5 w-3.5 text-text-muted" />
                <span>
                  Assigned: <strong>{selectedRfi.assignedTo}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-info/30 bg-info-bg/50 p-4 sm:p-5">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-info">
                  Current Ball-in-Court
                </span>
                <span className="text-body-sm font-semibold text-text">
                  {selectedRfi.ballInCourt}
                </span>
              </div>
              {selectedRfi.status !== 'Closed' && (
                <button
                  onClick={() => {
                    const next =
                      selectedRfi.ballInCourt === 'Consultant' ? 'Site Team' : 'Consultant';
                    setRfiList((prev) =>
                      prev.map((r) => (r.id === selectedRfi.id ? { ...r, ballInCourt: next } : r))
                    );
                    setSelectedRfi((prev) => (prev ? { ...prev, ballInCourt: next } : null));
                    notifications.show({
                      title: 'Ball-in-Court Switched',
                      message: `Handed over to ${next}.`,
                      color: 'blue',
                    });
                  }}
                  className="shadow-xs rounded-lg border border-info/30 bg-surface px-3 py-1.5 text-[11px] font-medium text-info transition-colors hover:bg-info-bg"
                >
                  Hand over &rarr;
                </button>
              )}
            </div>

            <div>
              <h4 className="mb-2.5 text-body-xs font-semibold uppercase tracking-wider text-text-muted">
                Field Inquiry Description
              </h4>
              <div className="shadow-xs rounded-2xl border border-border bg-surface p-5 text-body-sm leading-relaxed text-text">
                {selectedRfi.description ||
                  'Discrepancy identified between structural general arrangement drawings and architectural facade details at Level 12 Grid D4. Requesting reinforcement bend radius clarification to prevent clash with MEP sleeve.'}
              </div>
            </div>

            <div>
              <h4 className="mb-2.5 text-body-xs font-semibold uppercase tracking-wider text-text-muted">
                Consultant Official Response
              </h4>
              {selectedRfi.status === 'Answered' || selectedRfi.status === 'Closed' ? (
                <div className="shadow-xs space-y-2.5 rounded-2xl border border-success/30 bg-success-bg/40 p-5 text-body-sm text-text">
                  <div className="flex items-center gap-1.5 text-body-xs font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Response from Structural Consultant (R. Iyer)</span>
                  </div>
                  <p className="text-body-xs leading-relaxed">
                    Refer to revised detailing sketch SK-STR-014-A. Rebar may be cranked at 1:6
                    ratio to clear the MEP conduit sleeve. Concrete cover maintained at 40mm
                    minimum.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter consultant clarification response or sketch reference..."
                    className="w-full rounded-xl border border-border bg-background p-4 text-body-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleSendResponse}
                    className="shadow-xs inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-body-xs font-medium text-surface transition-colors hover:bg-primary/90"
                  >
                    <Send className="h-3 w-3" />
                    <span>Post Response</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
              <div className="flex gap-1.5">
                {selectedRfi.status !== 'Closed' ? (
                  <button
                    onClick={() => handleUpdateStatus('Closed')}
                    className="rounded-lg bg-success px-3 py-1.5 text-body-xs font-medium text-surface transition-colors hover:bg-success/90"
                  >
                    Close RFI
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus('Open')}
                    className="rounded-lg border border-border px-3 py-1.5 text-body-xs font-medium transition-colors hover:bg-background"
                  >
                    Reopen RFI
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedRfi(null)}
                className="rounded-lg border border-border px-3 py-1.5 text-body-xs font-medium transition-colors hover:bg-background"
              >
                Close Panel
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={
          <span className="font-heading text-lg font-semibold text-text">
            Draft Request for Information (RFI)
          </span>
        }
        radius="lg"
        centered
        size="md"
      >
        <form onSubmit={handleCreateRFI} className="space-y-4 pt-2">
          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              RFI Subject *
            </label>
            <input
              type="text"
              required
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Beam-Column junction clash at Grid D4"
              className="w-full rounded-lg border border-border px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-body-xs font-medium text-text-secondary">
                Assigned Consultant
              </label>
              <select
                value={newAssignedTo}
                onChange={(e) => setNewAssignedTo(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-body-sm focus:border-primary focus:outline-none"
              >
                <option value="Ekaa Studio (Architect)">Ekaa Studio (Architect)</option>
                <option value="R. Iyer (Structural Eng)">R. Iyer (Structural Eng)</option>
                <option value="MEP Consultant (HVAC/Plumbing)">MEP Consultant</option>
                <option value="Façade Consultant">Façade Consultant</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-body-xs font-medium text-text-secondary">
                Required Response SLA
              </label>
              <input
                type="date"
                value={newDue}
                onChange={(e) => setNewDue(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 font-mono text-body-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-body-xs font-medium text-text-secondary">
              Detailed Question / Specification Reference
            </label>
            <textarea
              rows={4}
              required
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Explain the jobsite issue, drawing conflict, or lack of specification detail..."
              className="w-full rounded-lg border border-border px-3 py-2 text-body-sm leading-relaxed focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-body-sm text-text transition-colors hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-body-sm font-medium text-surface transition-colors hover:bg-primary/90"
            >
              Submit RFI
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
