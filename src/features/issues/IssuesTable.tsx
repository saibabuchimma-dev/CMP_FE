'use client';

import { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight, 
  MessageSquare, 
  Send, 
  CheckSquare, 
  Wrench, 
  RefreshCw,
  HardHat,
  Filter
} from 'lucide-react';
import { Drawer, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { cn, formatDate } from '@/lib/utils';
import { DataTable } from '@/components/ui/Table';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import type { Issue, IssueType, IssuePriority, IssueStatus } from '@/types';

const TYPE_COLORS: Record<IssueType, { text: string; bg: string; border: string }> = {
  Safety: { text: '#AE4E22', bg: 'rgba(174, 78, 34, 0.1)', border: 'rgba(174, 78, 34, 0.3)' },
  Quality: { text: '#C67D0A', bg: 'rgba(198, 125, 10, 0.1)', border: 'rgba(198, 125, 10, 0.3)' },
  Design: { text: '#2B579A', bg: 'rgba(43, 87, 154, 0.1)', border: 'rgba(43, 87, 154, 0.3)' },
};

interface IssuesTableProps {
  issues: Issue[];
  onCreate?: () => void;
}

export function IssuesTable({ issues: initialIssues, onCreate }: IssuesTableProps) {
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [typeFilter, setTypeFilter] = useState<IssueType | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');
  const [query, setQuery] = useState('');

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<IssueType>('Safety');
  const [newPriority, setNewPriority] = useState<IssuePriority>('High');
  const [newLocation, setNewLocation] = useState('Floor 14 - Grid Line C/4');
  const [newAssignedTo, setNewAssignedTo] = useState('Apex Formwork Subcontractor');
  const [newDescription, setNewDescription] = useState('');

  const [commentText, setCommentText] = useState('');

  const filtered = useMemo(() => {
    return issueList.filter((i) => {
      const matchType = typeFilter === 'All' || i.type === typeFilter;
      const matchPriority = priorityFilter === 'All' || i.priority === priorityFilter;
      const matchStatus = statusFilter === 'All' || i.status === statusFilter;
      const matchQuery = query.trim() === '' || 
        i.id.toLowerCase().includes(query.toLowerCase()) || 
        i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.location.toLowerCase().includes(query.toLowerCase()) ||
        i.assignedTo.toLowerCase().includes(query.toLowerCase());
      return matchType && matchPriority && matchStatus && matchQuery;
    });
  }, [typeFilter, priorityFilter, statusFilter, query, issueList]);

  const openCount = issueList.filter(i => i.status === 'Open').length;
  const inProgressCount = issueList.filter(i => i.status === 'In Progress').length;
  const closedCount = issueList.filter(i => i.status === 'Closed').length;
  const safetyCount = issueList.filter(i => i.type === 'Safety').length;

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `ISS-${Math.floor(200 + Math.random() * 800)}`;
    const newIssue: Issue = {
      id: newId,
      title: newTitle.trim(),
      type: newType,
      priority: newPriority,
      status: 'Open',
      location: newLocation.trim() || 'General Site',
      assignedTo: newAssignedTo.trim() || 'General Contractor',
      date: new Date().toISOString().split('T')[0],
      description: newDescription.trim() || 'Immediate site inspection item noted during supervisory walkthrough.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setIssueList(prev => [newIssue, ...prev]);

    notifications.show({
      title: 'Issue Logged',
      message: `${newIssue.id}: "${newIssue.title}" assigned to ${newIssue.assignedTo}.`,
      color: 'orange',
    });

    setNewTitle('');
    setNewDescription('');
    setCreateModalOpen(false);
  };

  const handleUpdateStatus = (newStatus: IssueStatus) => {
    if (!selectedIssue) return;

    setIssueList(prev => prev.map(i => i.id === selectedIssue.id ? { ...i, status: newStatus } : i));
    setSelectedIssue(prev => prev ? { ...prev, status: newStatus } : null);

    notifications.show({
      title: 'Status Updated',
      message: `${selectedIssue.id} updated to ${newStatus}.`,
      color: newStatus === 'Closed' ? 'green' : newStatus === 'In Progress' ? 'blue' : 'orange',
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedIssue) return;

    notifications.show({
      title: 'Field Inspection Note Added',
      message: `Note recorded on ${selectedIssue.id}: "${commentText.trim().substring(0, 40)}..."`,
      color: 'blue',
    });

    setCommentText('');
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-border pb-9 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-body-xs font-semibold text-warning bg-warning-bg uppercase tracking-wider mb-2.5">
            <ShieldAlert className="h-3.5 w-3.5" />
            Field Snags & Punch List
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Site Safety, Quality & Punch Items
          </h1>
          <p className="mt-2 text-body-sm text-text-secondary leading-relaxed max-w-2xl">
            Defects, OSHA safety observations, and architectural snags logged directly from the field with trade accountability.
          </p>
        </div>
        <button
          onClick={() => (onCreate ? onCreate() : setCreateModalOpen(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-surface hover:bg-primary/90 font-medium text-body-sm transition-all shadow-sm hover:shadow active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Issue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-text-muted uppercase tracking-wider">Total Snags</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-text mt-3 tracking-tight">{issueList.length}</div>
          <div className="text-[12px] text-text-muted mt-2">Active project observations</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-danger uppercase tracking-wider">Safety Hazards</span>
            <div className="h-9 w-9 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-danger mt-3 tracking-tight">{safetyCount}</div>
          <div className="text-[12px] text-danger font-medium mt-2">Requires immediate mitigation</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-warning uppercase tracking-wider">In Progress</span>
            <div className="h-9 w-9 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-warning mt-3 tracking-tight">{inProgressCount}</div>
          <div className="text-[12px] text-text-muted mt-2">Trade remediation underway</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-success uppercase tracking-wider">Resolved</span>
            <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-success mt-3 tracking-tight">{closedCount}</div>
          <div className="text-[12px] text-success font-medium mt-2">Verified & closed by QC</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-3 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-background rounded-xl border border-border">
            {[
              { label: 'All', count: issueList.length },
              { label: 'Open', count: openCount },
              { label: 'In Progress', count: inProgressCount },
              { label: 'Closed', count: closedCount },
            ].map((tab) => {
              const isActive = statusFilter === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setStatusFilter(tab.label as any)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 text-body-xs font-semibold rounded-lg transition-all p-2',
                    isActive
                      ? 'bg-primary text-surface shadow-xs'
                      : 'text-text-secondary hover:text-text'
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-mono', isActive ? 'bg-white/20 text-white' : 'bg-border text-text-muted')}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 p-2">
            {(['All', 'Safety', 'Quality', 'Design'] as const).map((t) => {
              const isActive = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t as any)}
                  className={cn(
                    'px-3.5 py-1.5 text-body-xs font-semibold rounded-xl transition-all border p-2',
                    isActive
                      ? 'bg-background border-primary text-primary shadow-2xs'
                      : 'border-transparent text-text-secondary hover:text-text'
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

     
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
      placeholder="Search issue ID, title, trade, location..."
      className="w-full rounded-xl border border-border bg-background py-2 pr-4 text-body-xs shadow-xs transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
      style={{ paddingLeft: '46px' }}
    />
  </div>
</div>


      <DataTable<Issue>
        columns={[
          {
            key: 'id',
            header: 'Issue ID',
            width: '95px',
            render: (i) => (
              <span className="font-mono text-body-xs font-semibold text-text hover:text-primary transition-colors">
                {i.id}
              </span>
            ),
          },
          {
            key: 'title',
            header: 'Title & Summary',
            width: '2fr',
            render: (i) => (
              <div>
                <div className="font-medium text-text text-body-sm group-hover:text-primary transition-colors">
                  {i.title}
                </div>
                {i.description && (
                  <div className="text-[12px] text-text-muted truncate max-w-md mt-0.5">
                    {i.description}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Discipline',
            width: '100px',
            render: (i) => {
              const style = TYPE_COLORS[i.type] || TYPE_COLORS.Quality;
              return (
                <span
                  className="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-xs border"
                  style={{
                    color: style.text,
                    backgroundColor: style.bg,
                    borderColor: style.border,
                  }}
                >
                  {i.type}
                </span>
              );
            },
          },
          {
            key: 'priority',
            header: 'Priority',
            width: '100px',
            render: (i) => <PriorityBadge level={i.priority} />,
          },
          {
            key: 'status',
            header: 'Status',
            width: '115px',
            render: (i) => <StatusBadge status={i.status} type="issue" />,
          },
          {
            key: 'location',
            header: 'Location / Grid',
            width: '150px',
            render: (i) => (
              <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                <MapPin className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="truncate">{i.location}</span>
              </div>
            ),
          },
          {
            key: 'assignedTo',
            header: 'Assigned Trade',
            width: '150px',
            render: (i) => (
              <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                <HardHat className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="truncate">{i.assignedTo}</span>
              </div>
            ),
          },
          {
            key: 'date',
            header: 'Logged',
            width: '100px',
            render: (i) => (
              <span className="font-mono text-body-xs text-text-muted">
                {formatDate(i.date)}
              </span>
            ),
          },
        ]}
        data={filtered}
        keyExtractor={(i) => i.id}
        onRowClick={(item) => setSelectedIssue(item)}
        emptyMessage="No issues match your current filters"
        emptyIcon={<AlertTriangle className="h-10 w-10 text-text-muted" />}
      />

      <Drawer
        opened={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        position="right"
        size="lg"
        title={
          selectedIssue ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-body-sm font-bold text-primary">{selectedIssue.id}</span>
              <span className="text-text-muted">•</span>
              <span className="text-body-sm font-medium text-text truncate max-w-sm">
                {selectedIssue.title}
              </span>
            </div>
          ) : null
        }
        styles={{
          header: {
            borderBottom: '1px solid var(--color-border)',
            padding: '16px 20px',
          },
          body: {
            padding: '24px 20px',
          },
        }}
      >
        {selectedIssue && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedIssue.status} type="issue" />
                <PriorityBadge level={selectedIssue.priority} />
                <span
                  className="px-2 py-0.5 text-[11px] font-semibold rounded-xs border"
                  style={{
                    color: TYPE_COLORS[selectedIssue.type]?.text,
                    backgroundColor: TYPE_COLORS[selectedIssue.type]?.bg,
                    borderColor: TYPE_COLORS[selectedIssue.type]?.border,
                  }}
                >
                  {selectedIssue.type}
                </span>
              </div>
              <span className="text-[12px] font-mono text-text-muted">
                Logged: {formatDate(selectedIssue.date)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border space-y-3">
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Rectification & Sign-off Actions
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedIssue.status === 'Open' && (
                  <button
                    onClick={() => handleUpdateStatus('In Progress')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning text-surface text-body-xs font-medium hover:bg-warning/90 transition-all shadow-xs"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Assign & Begin Rectification</span>
                  </button>
                )}
                {selectedIssue.status === 'In Progress' && (
                  <button
                    onClick={() => handleUpdateStatus('Closed')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success text-surface text-body-xs font-medium hover:bg-success/90 transition-all shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>QA/QC Sign-off & Close</span>
                  </button>
                )}
                {selectedIssue.status === 'Closed' && (
                  <button
                    onClick={() => handleUpdateStatus('In Progress')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-text text-body-xs font-medium hover:bg-surface transition-all"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Re-open Snag Item</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-border bg-surface">
              <div>
                <div className="text-[11px] font-medium text-text-muted flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-text-muted" />
                  Exact Location
                </div>
                <div className="text-body-sm font-semibold text-text">
                  {selectedIssue.location}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-medium text-text-muted flex items-center gap-1.5 mb-1">
                  <HardHat className="h-3.5 w-3.5 text-text-muted" />
                  Responsible Trade
                </div>
                <div className="text-body-sm font-semibold text-text">
                  {selectedIssue.assignedTo}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-body-sm font-semibold text-text flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" />
                Defect Observation & Hazard Note
              </h3>
              <div className="p-4 rounded-xl bg-surface border border-border text-body-sm text-text-secondary leading-relaxed">
                {selectedIssue.description || 'No additional technical narrative provided for this field observation.'}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-body-sm font-semibold text-text flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Inspection Verification Checklist
              </h3>
              <div className="space-y-2 p-3.5 rounded-xl border border-border bg-surface text-body-xs">
                <label className="flex items-center gap-2.5 text-text-secondary hover:text-text cursor-pointer">
                  <input type="checkbox" defaultChecked={selectedIssue.status !== 'Open'} className="rounded border-border text-primary focus:ring-0" />
                  <span>Subcontractor foreman notified and briefed on corrective action</span>
                </label>
                <label className="flex items-center gap-2.5 text-text-secondary hover:text-text cursor-pointer">
                  <input type="checkbox" defaultChecked={selectedIssue.status === 'Closed'} className="rounded border-border text-primary focus:ring-0" />
                  <span>Hazard physically barricaded / red-tagged if applicable</span>
                </label>
                <label className="flex items-center gap-2.5 text-text-secondary hover:text-text cursor-pointer">
                  <input type="checkbox" defaultChecked={selectedIssue.status === 'Closed'} className="rounded border-border text-primary focus:ring-0" />
                  <span>Post-remediation photographic proof verified by QC Inspector</span>
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-body-sm font-semibold text-text flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Field Inspection Log & Notes
              </h3>

              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-border bg-background text-body-xs">
                  <div className="flex items-center justify-between text-text-muted mb-1">
                    <span className="font-semibold text-text">Site Safety Officer</span>
                    <span>{formatDate(selectedIssue.date)}</span>
                  </div>
                  <p className="text-text-secondary">
                    Initial snag recorded during morning walk. Work halted in immediate proximity until structural props are verified.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add inspection note or resolution update..."
                  className="flex-1 px-3 py-2 text-body-sm bg-surface border border-border rounded-lg placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                />
                <button
                  onClick={handleAddComment}
                  className="px-3.5 py-2 rounded-lg bg-primary text-surface hover:bg-primary/90 transition-all shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-heading font-bold text-lg text-text">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Log Field Issue / Punch Item</span>
          </div>
        }
        size="lg"
        centered
        styles={{
          header: { borderBottom: '1px solid var(--color-border)', padding: '16px 24px' },
          body: { padding: '24px' },
        }}
      >
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Issue Title / Deficiency Summary *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Missing safety guardrail at elevator shaft edge"
              className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Category
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as IssueType)}
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Safety">Safety</option>
                <option value="Quality">Quality</option>
                <option value="Design">Design</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Severity / Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as IssuePriority)}
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="High">High (Immediate Action)</option>
                <option value="Medium">Medium (Fix within 48h)</option>
                <option value="Low">Low (Routine Punch)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Exact Location / Grid Reference
              </label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Level 14 - North Core Wall Grid C-4"
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Assigned Subcontractor / Trade
              </label>
              <input
                type="text"
                value={newAssignedTo}
                onChange={(e) => setNewAssignedTo(e.target.value)}
                placeholder="e.g. Formwork & Shoring Sub"
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Defect Description & Required Corrective Action
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe observation, immediate risk, and remedial steps required..."
              className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-border text-body-sm font-medium text-text hover:bg-background transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-surface text-body-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
            >
              Log Snag Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}