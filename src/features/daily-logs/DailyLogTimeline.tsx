'use client';

import { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  CloudSun, 
  CloudRain, 
  Users, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Search, 
  HardHat, 
  CheckCircle2, 
  ShieldCheck, 
  Thermometer, 
  Wind, 
  FileText,
  Hammer
} from 'lucide-react';
import { Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { cn, formatDate } from '@/lib/utils';
import type { DailyLog } from '@/types';

interface DailyLogTimelineProps {
  logs: DailyLog[];
  onCreate?: () => void;
}

export function DailyLogTimeline({ logs: initialLogs, onCreate }: DailyLogTimelineProps) {
  const [logList, setLogList] = useState<DailyLog[]>(initialLogs);
  const [query, setQuery] = useState('');
  const [filterDelayOnly, setFilterDelayOnly] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newWeather, setNewWeather] = useState('Clear / Sunny');
  const [newTemperature, setNewTemperature] = useState('29°C (84°F)');
  const [newManpower, setNewManpower] = useState(145);
  const [newSummary, setNewSummary] = useState('');
  const [newDelays, setNewDelays] = useState('None');

  const filteredLogs = useMemo(() => {
    return logList.filter((log) => {
      const matchDelay = !filterDelayOnly || log.delays !== 'None';
      const matchQuery = query.trim() === '' || 
        log.date.toLowerCase().includes(query.toLowerCase()) || 
        log.summary.toLowerCase().includes(query.toLowerCase()) ||
        log.weather.toLowerCase().includes(query.toLowerCase()) ||
        log.delays.toLowerCase().includes(query.toLowerCase());
      return matchDelay && matchQuery;
    });
  }, [logList, query, filterDelayOnly]);

  const totalHeadcount = logList.reduce((acc, l) => acc + l.manpower, 0);
  const avgHeadcount = logList.length ? Math.round(totalHeadcount / logList.length) : 0;
  const delayLogsCount = logList.filter(l => l.delays !== 'None').length;

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;

    const newLog: DailyLog = {
      date: newDate,
      weather: newWeather,
      temperature: newTemperature,
      manpower: Number(newManpower) || 120,
      summary: newSummary.trim(),
      delays: newDelays.trim() || 'None',
      createdAt: new Date().toISOString(),
    };

    setLogList(prev => [newLog, ...prev]);

    notifications.show({
      title: 'Daily Log Submitted',
      message: `Shift record for ${newLog.date} saved with ${newLog.manpower} personnel on site.`,
      color: 'green',
    });

    setNewSummary('');
    setNewDelays('None');
    setCreateModalOpen(false);
  };

  const getWeatherIcon = (weatherStr: string) => {
    const lower = weatherStr.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower') || lower.includes('storm')) {
      return <CloudRain className="h-4 w-4 text-info" />;
    }
    return <CloudSun className="h-4 w-4 text-warning" />;
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between border-b border-border pb-7 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-body-xs font-semibold text-primary bg-primary/10 uppercase tracking-wider mb-2.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Superintendent Field Journals
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Daily Construction Logs & Shift Records
          </h1>
          <p className="mt-2 text-body-sm text-text-secondary leading-relaxed max-w-2xl">
            Shift-by-shift field reports capturing site weather, trade headcount, concrete pours, inspections, and downtime.
          </p>
        </div>
        <button
          onClick={() => (onCreate ? onCreate() : setCreateModalOpen(true))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-surface hover:bg-primary/90 font-medium text-body-sm transition-all shadow-sm hover:shadow active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Daily Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-text-muted uppercase tracking-wider">Total Shift Logs</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-text mt-3 tracking-tight">{logList.length}</div>
          <div className="text-[12px] text-text-muted mt-2">Recorded field shift entries</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-text-muted uppercase tracking-wider">Avg Site Headcount</span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-primary mt-3 tracking-tight">
            {avgHeadcount} <span className="text-xs font-normal text-text-muted font-sans">tradesmen/day</span>
          </div>
          <div className="text-[12px] text-text-muted mt-2">Active trade workforce on site</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-text-muted uppercase tracking-wider">Incident-Free Days</span>
            <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-success mt-3 tracking-tight">{logList.length * 7 + 12}</div>
          <div className="text-[12px] text-success font-medium mt-2">Zero Lost-Time Injuries (LTI)</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl border border-border bg-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-body-xs font-semibold text-warning uppercase tracking-wider">Logs with Delays</span>
            <div className="h-9 w-9 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-warning mt-3 tracking-tight">{delayLogsCount}</div>
          <div className="text-[12px] text-text-muted mt-2">Weather or operational downtime</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-5 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterDelayOnly(false)}
            className={cn(
              'px-4 py-2 text-body-xs font-semibold rounded-xl transition-all p-2',
              !filterDelayOnly
                ? 'bg-primary text-surface shadow-xs'
                : 'text-text-secondary hover:bg-background border border-border'
            )}
          >
            All Logs ({logList.length})
          </button>
          <button
            onClick={() => setFilterDelayOnly(true)}
            className={cn(
              'px-4 py-2 text-body-xs font-semibold rounded-xl transition-all flex items-center gap-2',
              filterDelayOnly
                ? 'bg-warning text-surface shadow-xs'
                : 'text-text-secondary hover:bg-background border border-border'
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Delays Only ({delayLogsCount})</span>
          </button>
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
      placeholder="Search logs by activity, date, delay..."
      className="w-full rounded-xl border border-border bg-background py-2 pr-4 text-body-xs shadow-xs transition-all placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
      style={{ paddingLeft: '46px' }}
    />
  </div>
</div>

      </div>

      <div className="space-y-6">
        {filteredLogs.map((log) => {
          const hasDelay = log.delays && log.delays !== 'None';
          
          return (
            <div
              key={log.date}
              className="bg-surface rounded-2xl border border-border shadow-xs hover:shadow-card-hover transition-all p-6 sm:p-7 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-background border border-border flex flex-col items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-primary leading-none">
                      {new Date(log.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-base font-bold font-mono text-text leading-none mt-1">
                      {new Date(log.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="text-body-base font-bold text-text">
                      {formatDate(log.date, 'long')}
                    </div>
                    <div className="text-[12px] text-text-muted mt-0.5">
                      General Contractor Shift Journal # {log.date.replace(/-/g, '')}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-medium bg-background border border-border text-text-secondary">
                    {getWeatherIcon(log.weather)}
                    <span>{log.weather}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-mono text-text-secondary bg-background border border-border">
                    <Thermometer className="h-3.5 w-3.5 text-text-muted" />
                    <span>{log.temperature}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Users className="h-3.5 w-3.5" />
                    <span>{log.manpower} Crew on site</span>
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Activities & Progress Summary
                </div>
                <p className="text-body-sm text-text leading-relaxed bg-background/60 p-4 sm:p-5 rounded-xl border border-border/80">
                  {log.summary}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background flex flex-wrap items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-2 text-text-secondary font-medium">
                  <HardHat className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-text">Trade Headcount:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-text">
                    Formwork: {Math.round(log.manpower * 0.35)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-text">
                    Rebar: {Math.round(log.manpower * 0.30)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-text">
                    MEP: {Math.round(log.manpower * 0.20)}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-text">
                    QA/QC: {Math.max(4, Math.round(log.manpower * 0.08))}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-surface border border-border text-text">
                    Ops: {Math.max(2, Math.round(log.manpower * 0.07))}
                  </span>
                </div>
              </div>

              {hasDelay && (
                <div className="p-3 rounded-lg bg-warning-bg border border-warning/30 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div>
                    <div className="text-body-xs font-semibold text-warning">
                      Reported Blocker / Delay Notice:
                    </div>
                    <div className="text-body-xs text-text mt-0.5">
                      {log.delays}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-[11px] text-text-muted">
                <div className="flex items-center gap-1.5 text-success">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="font-medium">Signed & Certified by Project Superintendent</span>
                </div>
                <div className="font-mono">
                  Transmitted to Owner Portal: 18:30 IST
                </div>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center rounded-xl border border-dashed border-border bg-surface">
            <CalendarDays className="h-10 w-10 mx-auto text-text-muted mb-2" />
            <div className="text-heading-sm font-semibold text-text">No daily logs match your search</div>
            <p className="text-body-sm text-text-muted mt-1">
              Try adjusting your query or log filter.
            </p>
          </div>
        )}
      </div>

      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-heading font-bold text-lg text-text">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span>Submit Daily Superintendent Log</span>
          </div>
        }
        size="lg"
        centered
        styles={{
          header: { borderBottom: '1px solid var(--color-border)', padding: '16px 24px' },
          body: { padding: '24px' },
        }}
      >
        <form onSubmit={handleCreateLog} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Log Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Total Manpower Headcount *
              </label>
              <input
                type="number"
                required
                min={1}
                value={newManpower}
                onChange={(e) => setNewManpower(Number(e.target.value))}
                placeholder="e.g. 142"
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Weather Conditions
              </label>
              <select
                value={newWeather}
                onChange={(e) => setNewWeather(e.target.value)}
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Clear / Sunny">Clear / Sunny</option>
                <option value="Partly Cloudy">Partly Cloudy</option>
                <option value="Light Showers">Light Showers</option>
                <option value="Heavy Rain / Wind">Heavy Rain / Wind</option>
                <option value="Overcast">Overcast</option>
              </select>
            </div>

            <div>
              <label className="block text-body-xs font-semibold text-text mb-1.5">
                Average Ambient Temperature
              </label>
              <input
                type="text"
                value={newTemperature}
                onChange={(e) => setNewTemperature(e.target.value)}
                placeholder="e.g. 29°C (84°F)"
                className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Shift Activities & Progress Summary *
            </label>
            <textarea
              required
              rows={4}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Detail major activities completed today: e.g. Poured 120m3 of grade M40 concrete on Level 14 core slab. Completed steel reinforcement on beam Grid C-D..."
              className="w-full px-3.5 py-2 text-body-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-body-xs font-semibold text-text mb-1.5">
              Delays, Downtime or Stoppages
            </label>
            <input
              type="text"
              value={newDelays}
              onChange={(e) => setNewDelays(e.target.value)}
              placeholder="e.g. None, or Rain delay (2 hours), or Tower crane electrical maintenance..."
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
              Save Shift Journal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}