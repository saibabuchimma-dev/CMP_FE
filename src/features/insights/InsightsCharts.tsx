'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Layers,
  FileCheck2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell, 
  Legend 
} from 'recharts';
import { cn } from '@/lib/utils';
import { DOCUMENT_STATUS_CONFIG } from '@/constants';
import type { Project } from '@/types';

interface InsightsChartsProps {
  project: Project;
}

const PALETTE = {
  primary: '#1F3A4E',
  primaryLight: '#2B579A',
  success: '#2E6930',
  warning: '#C67D0A',
  danger: '#AE4E22',
  muted: '#8A857A',
  border: '#E2DED5',
  surface: '#FFFFFF',
  background: '#F5F3EE',
};

function ChartCard({ 
  title, 
  subtitle, 
  badge,
  children, 
  className 
}: { 
  title: string; 
  subtitle?: string; 
  badge?: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('bg-surface rounded-2xl border border-border p-6 sm:p-7 shadow-xs flex flex-col', className)}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading font-semibold text-text text-body-base">
            {title}
          </h3>
          {subtitle && (
            <p className="text-body-xs text-text-muted mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className="px-2.5 py-1 rounded-lg text-body-xs font-semibold uppercase tracking-wider bg-background border border-border text-text-secondary shrink-0">
            {badge}
          </span>
        )}
      </div>
      <div className="h-[300px] w-full flex-1">{children}</div>
    </div>
  );
}

function ProgressSCurveChart({ project }: { project: Project }) {
  const sCurveData = [
    { month: 'Mar 26', planned: 5, actual: 5 },
    { month: 'Apr 26', planned: 12, actual: 14 },
    { month: 'May 26', planned: 22, actual: 24 },
    { month: 'Jun 26', planned: 35, actual: 38 },
    { month: 'Jul 26', planned: 48, actual: 47 },
    { month: 'Aug 26', planned: 60, actual: 59 },
    { month: 'Sep 26', planned: 72, actual: project.percentComplete || 68 },
    { month: 'Oct 26', planned: 83, actual: null },
    { month: 'Nov 26', planned: 92, actual: null },
    { month: 'Dec 26', planned: 100, actual: null },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={sCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PALETTE.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={PALETTE.primary} stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PALETTE.muted} stopOpacity={0.15} />
            <stop offset="95%" stopColor={PALETTE.muted} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2DED5" vertical={false} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={{ stroke: '#E2DED5' }} 
          tickLine={false} 
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={false} 
          tickLine={false} 
          unit="%" 
        />
        <Tooltip 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: '#E2DED5', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
          }}
          formatter={(value: any, name: string) => [
            value !== null ? `${value}%` : 'Projected', 
            name === 'actual' ? 'Actual Cumulative' : 'Baseline Planned'
          ]}
        />
        <Legend 
          verticalAlign="top" 
          height={36} 
          iconType="circle"
          formatter={(value) => (
            <span className="text-[12px] font-medium text-text-secondary">
              {value === 'actual' ? 'Actual Progress' : 'Baseline Target'}
            </span>
          )}
        />
        <Area 
          type="monotone" 
          dataKey="planned" 
          stroke={PALETTE.muted} 
          strokeWidth={2} 
          strokeDasharray="4 4"
          fillOpacity={1} 
          fill="url(#colorPlanned)" 
        />
        <Area 
          type="monotone" 
          dataKey="actual" 
          stroke={PALETTE.primary} 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorActual)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ManpowerTrendChart({ project }: { project: Project }) {
  const manpowerData = [
    { day: '08/25', structural: 82, mep: 35, finishing: 20 },
    { day: '08/26', structural: 85, mep: 38, finishing: 22 },
    { day: '08/27', structural: 80, mep: 40, finishing: 25 },
    { day: '08/28', structural: 90, mep: 42, finishing: 26 },
    { day: '08/29', structural: 94, mep: 45, finishing: 28 },
    { day: '08/30', structural: 96, mep: 44, finishing: 30 },
    { day: '09/01', structural: 88, mep: 42, finishing: 28 },
    { day: '09/02', structural: 92, mep: 46, finishing: 32 },
    { day: '09/03', structural: 95, mep: 48, finishing: 35 },
    { day: '09/04', structural: 98, mep: 50, finishing: 38 },
    { day: '09/05', structural: 94, mep: 48, finishing: 36 },
    { day: '09/06', structural: 86, mep: 44, finishing: 34 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={manpowerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2DED5" vertical={false} />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={{ stroke: '#E2DED5' }} 
          tickLine={false} 
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: '#E2DED5', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
          }}
          formatter={(value: any, name: string) => [`${value} workers`, name.charAt(0).toUpperCase() + name.slice(1)]}
        />
        <Legend 
          verticalAlign="top" 
          height={36} 
          iconType="circle"
          formatter={(value) => (
            <span className="text-[12px] font-medium text-text-secondary">
              {value === 'structural' ? 'Structural (Form & Rebar)' : value === 'mep' ? 'MEP Trades' : 'Finishing & QA'}
            </span>
          )}
        />
        <Bar dataKey="structural" stackId="a" fill={PALETTE.primary} radius={[0, 0, 0, 0]} />
        <Bar dataKey="mep" stackId="a" fill={PALETTE.primaryLight} radius={[0, 0, 0, 0]} />
        <Bar dataKey="finishing" stackId="a" fill={PALETTE.warning} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RFISLATurnaroundChart({ project }: { project: Project }) {
  const rfiTurnaroundData = [
    { tier: '< 3 Days', count: 18, color: PALETTE.success, desc: 'Expedited' },
    { tier: '3 - 7 Days', count: 12, color: PALETTE.primaryLight, desc: 'Within Standard SLA' },
    { tier: '7 - 14 Days', count: 4, color: PALETTE.warning, desc: 'Escalated' },
    { tier: '> 14 Days', count: 2, color: PALETTE.danger, desc: 'Overdue / Critical' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rfiTurnaroundData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2DED5" vertical={false} />
        <XAxis 
          type="number" 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={{ stroke: '#E2DED5' }} 
          tickLine={false} 
        />
        <YAxis 
          type="category" 
          dataKey="tier" 
          tick={{ fontSize: 11, fill: '#1F3A4E', fontWeight: 500 }} 
          axisLine={false} 
          tickLine={false} 
          width={80} 
        />
        <Tooltip 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: '#E2DED5', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 8 
          }}
          formatter={(value: any) => [`${value} RFIs`, 'Volume']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {rfiTurnaroundData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function IssuesByTypeChart({ project }: { project: Project }) {
  const issueTypes = ['Safety', 'Quality', 'Design'] as const;
  const issueTypeData = issueTypes.map((type) => {
    const matching = project.issues.filter((i) => i.type === type);
    return {
      name: type,
      open: matching.filter((i) => i.status !== 'Closed').length || 1,
      resolved: matching.filter((i) => i.status === 'Closed').length || 2,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={issueTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2DED5" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={{ stroke: '#E2DED5' }} 
          tickLine={false} 
        />
        <YAxis 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={false} 
          tickLine={false} 
        />
        <Tooltip 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: '#E2DED5', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 8 
          }}
          formatter={(val: any, name: string) => [`${val} items`, name === 'open' ? 'Active / In Progress' : 'Resolved & Closed']}
        />
        <Legend 
          verticalAlign="top" 
          height={36} 
          iconType="circle"
          formatter={(val) => (
            <span className="text-[12px] font-medium text-text-secondary">
              {val === 'open' ? 'Active Snags' : 'Resolved'}
            </span>
          )}
        />
        <Bar dataKey="open" fill={PALETTE.danger} radius={[3, 3, 0, 0]} />
        <Bar dataKey="resolved" fill={PALETTE.success} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function DocumentStatusChart({ project }: { project: Project }) {
  const docStatusData = Object.entries(DOCUMENT_STATUS_CONFIG).map(([key, config]) => ({
    name: config.label,
    count: project.docs.filter((d) => d.status === key).length,
    color: config.color,
  })).filter(d => d.count > 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={docStatusData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2DED5" vertical={false} />
        <XAxis 
          type="number" 
          tick={{ fontSize: 11, fill: '#8A857A' }} 
          axisLine={{ stroke: '#E2DED5' }} 
          tickLine={false} 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 11, fill: '#1F3A4E', fontWeight: 500 }} 
          axisLine={false} 
          tickLine={false} 
          width={100} 
        />
        <Tooltip 
          contentStyle={{ 
            fontSize: 12, 
            borderColor: '#E2DED5', 
            backgroundColor: '#FFFFFF', 
            borderRadius: 8 
          }}
          formatter={(value: any) => [`${value} sheets`, 'Count']}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {docStatusData.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function InsightsCharts({ project }: InsightsChartsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'quality' | 'manpower'>('all');

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-primary bg-primary/10 uppercase tracking-wider mb-2">
            <TrendingUp className="h-3 w-3" />
            Project Controls & Executive Analytics
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Site Performance & Quality Intelligence
          </h1>
          <p className="mt-1 text-body-sm text-text-secondary">
            Earned value analytics, S-Curve variance, trade labor density, and engineering turnaround SLAs for {project.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">Schedule SPI</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 text-primary" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-text tracking-tight">
              0.98 <span className="text-body-xs font-medium text-warning font-sans ml-1.5">(On Target)</span>
            </div>
            <p className="mt-1 text-body-xs text-text-muted">Earned schedule performance</p>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">Peak Headcount</span>
            <div className="h-9 w-9 rounded-xl bg-info/10 flex items-center justify-center">
              <Users className="h-4.5 w-4.5 text-info" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-primary tracking-tight">
              182 <span className="text-body-xs font-normal text-text-muted font-sans ml-1.5">tradesmen</span>
            </div>
            <p className="mt-1 text-body-xs text-text-muted">Across 8 active subcontractors</p>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">Avg RFI Turnaround</span>
            <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center">
              <Clock className="h-4.5 w-4.5 text-success" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-success tracking-tight">
              3.4 <span className="text-body-xs font-normal text-text-muted font-sans ml-1.5">days</span>
            </div>
            <p className="mt-1 text-body-xs text-text-muted">Below 5-day contractual threshold</p>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold uppercase tracking-wider text-text-muted">Safety Observation Rate</span>
            <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center">
              <ShieldCheck className="h-4.5 w-4.5 text-success" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono text-text tracking-tight">
              94% <span className="text-body-xs font-semibold text-success font-sans ml-1.5">Compliant</span>
            </div>
            <p className="mt-1 text-body-xs text-text-muted">Zero lost-time safety incidents</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto scrollbar-thin">
        {[
          { id: 'all', label: 'All Project Controls' },
          { id: 'schedule', label: 'Progress & S-Curve' },
          { id: 'manpower', label: 'Manpower & Labor' },
          { id: 'quality', label: 'Quality & RFIs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-xl text-body-xs font-semibold transition-all shrink-0',
              activeTab === tab.id
                ? 'bg-primary text-surface shadow-xs'
                : 'text-text-secondary hover:bg-background hover:text-text'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {(activeTab === 'all' || activeTab === 'schedule') && (
          <ChartCard 
            title="Earned Value S-Curve (Planned vs Actual %)" 
            subtitle="Cumulative milestone completion progress vs baseline project schedule"
            badge="Baseline Schedule"
          >
            <ProgressSCurveChart project={project} />
          </ChartCard>
        )}

        {(activeTab === 'all' || activeTab === 'manpower') && (
          <ChartCard 
            title="14-Day Labor Manpower Stacking" 
            subtitle="Shift headcount broken down by structural, MEP, and finishing trades"
            badge="Site Superintendent Log"
          >
            <ManpowerTrendChart project={project} />
          </ChartCard>
        )}

        {(activeTab === 'all' || activeTab === 'quality') && (
          <ChartCard 
            title="RFI Resolution SLA Turnaround" 
            subtitle="Turnaround velocity for technical architectural and structural clarifications"
            badge="Engineering Controls"
          >
            <RFISLATurnaroundChart project={project} />
          </ChartCard>
        )}

        {(activeTab === 'all' || activeTab === 'quality') && (
          <ChartCard 
            title="Field Punch Snags by Discipline" 
            subtitle="Ratio of active open observations versus rectified and verified snags"
            badge="QA/QC Verification"
          >
            <IssuesByTypeChart project={project} />
          </ChartCard>
        )}

        {activeTab === 'all' && (
          <ChartCard 
            title="Engineering Document Release Status" 
            subtitle="Distribution of IFC drawings and specifications by approval state"
            badge="CDE Document Register"
            className="lg:col-span-2"
          >
            <DocumentStatusChart project={project} />
          </ChartCard>
        )}
      </div>
    </div>
  );
}